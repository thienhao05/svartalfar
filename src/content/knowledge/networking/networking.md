---
title: 'Mạng máy tính cơ bản: IP, CIDR, FTP và Docker network'
description: 'Từ mô hình tầng, địa chỉ IPv4 và CIDR đến FTP/FTPS/SFTP và cách Docker cô lập các network.'
date: 2026-10-31
lang: vi
area: learning
series: 'Docker'
seriesOrder: 2
categories: ['Networking']
tags: ['networking', 'ip', 'cidr', 'ftp', 'docker']
related: ['networking/dns-hoat-dong-the-nao', 'networking/tcp-handshake']
---

## Bối cảnh

Khi làm backend và deploy lên VPS, hầu hết lỗi "không kết nối được" đều quy về mạng: hai máy có cùng mạng không, port nào đang mở, container nào nằm ở network nào. Bài này gom phần nền cần hiểu để tự khoanh vùng lỗi thay vì đoán: mô hình tầng, địa chỉ IP, CIDR, FTP và cách Docker chia network.

## Mạng máy tính là gì?

Gửi một món hàng từ Hà Nội vào Sài Gòn có nhiều công đoạn: đóng gói, dán nhãn địa chỉ, chọn tuyến vận chuyển, chở bằng xe.

> Thay vì coi đó là một việc to, người ta **chia thành các bước, mỗi bước một bộ phận lo**. Bảng chia bước đó chính là "mô hình".

Mạng cũng vậy. Gửi dữ liệu từ máy A sang máy B là việc rất phức tạp, nên người ta chia thành các tầng, mỗi tầng đảm nhiệm một nhiệm vụ.

| Lợi ích              | Giải thích                                                            |
| -------------------- | --------------------------------------------------------------------- |
| **Chia để trị**      | Mỗi tầng làm một việc, dễ thiết kế và dễ sửa.                         |
| **Thay thế độc lập** | Đổi Wi-Fi sang cáp mạng (tầng dưới) mà HTTP (tầng trên) không đổi gì. |
| **Ngôn ngữ chung**   | Nói "lỗi tầng 4" là hiểu ngay đó là lỗi TCP/port.                     |
| **Dễ tìm lỗi**       | Kiểm tra từng tầng từ dưới lên để khoanh vùng.                        |

## OSI và TCP/IP

Mô hình chỉ là bản vẽ. Phần thực hiện là các giao thức và phần mềm cụ thể nằm ở từng tầng:

- **TCP** (Transmission Control Protocol): chia dữ liệu thành gói, đánh số, đảm bảo đến đủ và đúng thứ tự.
- **IP** (Internet Protocol): gắn địa chỉ IP và tìm đường cho gói tin đi qua các router.
- **OSI** (Open Systems Interconnection): mô hình tham chiếu 7 tầng do tổ chức tiêu chuẩn quốc tế **ISO** đưa ra (hoàn thiện năm 1984).

![So sánh mô hình OSI 7 tầng với TCP/IP 4 tầng, kèm ví dụ giao thức ở từng tầng](../../../assets/knowledge/networking/osi-tcpip-layers.png)

> TCP/IP là thứ đang chạy, OSI là bản vẽ để hiểu và nói chuyện.

## IP làm gì?

**IP** làm hai việc:

1. **Đặt địa chỉ** cho mỗi thiết bị (chính xác hơn: mỗi card mạng) trong mạng.
2. **Chuyển gói tin** từ địa chỉ nguồn đến địa chỉ đích, đi qua nhiều router trung gian.

Nó giống **địa chỉ nhà cộng bưu điện**: địa chỉ cho biết nhà ở đâu, còn router là các bưu cục chuyển thư từng chặng. IP chỉ cố gắng chuyển (best effort), **không đảm bảo** gói đến nơi. Việc đảm bảo là của TCP ở tầng trên.

## Địa chỉ IPv4

**IPv4** là địa chỉ dài **32 bit**, dùng để nhận diện mỗi thiết bị trong mạng. Con người viết nó thành 4 số thập phân ngăn cách bằng dấu chấm, ví dụ `192.168.1.5`. Bản chất đó là một số nguyên 32 bit, dấu chấm và số thập phân chỉ là cách viết cho dễ đọc.

```text
192      .  168      .  1        .  5
11000000 .  10101000 .  00000001 .  00000101
|-8 bit-|    |-8 bit-|   |-8 bit-|   |-8 bit-|   = 32 bit
```

**Vì sao mỗi số chỉ từ 0 đến 255?** 8 bit có 2⁸ = **256 tổ hợp**, đếm từ 0 nên giá trị lớn nhất là **255** (`11111111` = 128+64+32+16+8+4+2+1). Tổng quát, n bit biểu diễn các số từ 0 đến 2ⁿ − 1.

**Vì sao chia 4 nhóm 8 bit?** 8 bit là 1 byte, đơn vị quen thuộc của máy tính. Viết mỗi byte thành một số thập phân dễ đọc hơn nhiều so với dãy 32 chữ số 0 và 1. Cách chia này chỉ là **cách trình bày**, địa chỉ thật vẫn là một số liền mạch.

**Vì sao tổng là 32 bit?** Không suy ra được bằng toán, đây là **quyết định thiết kế**: năm 1981 (RFC 791) người ta chọn 32 bit, cho khoảng 4,3 tỷ địa chỉ, vì thấy là quá đủ cho một mạng thí nghiệm. Theo lời Vint Cerf kể lại, đó chỉ định là thử nghiệm, nhưng nó trở thành Internet nên 32 bit bị giữ đến nay. Nay hóa ra không đủ, nên mới có IPv6 (128 bit).

## Network và Host

Một địa chỉ gồm hai phần:

- **Network**: bạn ở khu nào (giống tên phố).
- **Host**: bạn là máy nào trong khu đó (giống số nhà).

Ranh giới do **subnet mask** quyết định: bit 1 là phần network, bit 0 là phần host.

```text
IP:    192.168.1.5   = 11000000.10101000.00000001.00000101
Mask:  255.255.255.0 = 11111111.11111111.11111111.00000000
                       |------- network -------| |-host-|
```

Muốn gửi thư, bưu điện nhìn **tên phố** trước để chuyển đến đúng khu, rồi mới tìm **số nhà**. IP hoạt động y như vậy:

```text
192.168.1  .  5
|-network-|  |host|
 "phố nào"   "nhà nào"
```

## CIDR: vì sao viết `/24`?

Cách viết gốc phải dùng subnet mask `255.255.255.0`, dài và khó nhìn. Đếm số bit 1 trong mask ra 24, nên viết gọn là `/24`. Cách viết đó gọi là **CIDR**.

```text
255.255.255.0 = 11111111.11111111.11111111.00000000
                |------ 24 bit 1 -------|  8 bit 0
```

Với `192.168.1.5/24`: 24 bit đầu là network, phần host còn lại là 32 − 24 = **8 bit**. Ba số đầu `192.168.1` là "tên khu phố", số cuối `5` là "số nhà".

![Thanh trượt prefix /24 trên địa chỉ 192.168.1.5: 24 bit network, 8 bit host, mask 255.255.255.0, network 192.168.1.0, broadcast 192.168.1.255, 254 máy dùng được](../../../assets/knowledge/networking/cidr-bits.png)

Càng ít bit network thì càng nhiều bit host, nên mạng càng lớn:

| CIDR  | Bit network | Bit host | Số máy dùng được |
| ----- | ----------- | -------- | ---------------- |
| `/8`  | 8           | 24       | hơn 16 triệu     |
| `/16` | 16          | 16       | 65.534           |
| `/24` | 24          | 8        | 254              |
| `/30` | 30          | 2        | 2                |
| `/32` | 32          | 0        | đúng 1 máy       |

Công thức số máy: **2^(bit host) − 2**. Trừ 2 vì một địa chỉ làm network address (host toàn bit 0), một địa chỉ làm broadcast (host toàn bit 1). Với `/24`: 2⁸ − 2 = **254 máy**.

Với `192.168.1.5/24`:

| Thành phần             | Giá trị              | Ý nghĩa                                              |
| ---------------------- | -------------------- | ---------------------------------------------------- |
| **Network address**    | `192.168.1.0`        | Tên cả mạng (host toàn bit 0), không gán cho máy nào |
| **Broadcast address**  | `192.168.1.255`      | Gửi cho mọi máy trong mạng (host toàn bit 1)         |
| **Dải host dùng được** | `.1` đến `.254`      | 2⁸ − 2 = **254 máy**                                 |
| **Gateway**            | thường `192.168.1.1` | Cửa ra, chính là router                              |

Máy `192.168.1.200` **cùng mạng**, còn `192.168.2.5` **khác mạng** vì ba số đầu khác nhau.

**Cách máy quyết định đường đi:** lấy IP đích **AND** với mask. Nếu ra đúng network của mình thì gửi trực tiếp, nếu khác thì đưa cho gateway.

> Các ví dụ trong bài dùng mask `/24`, nên phần network là 3 số đầu. Với `/16` chỉ so 2 số đầu. Với `/20`, `/26`... ranh giới nằm giữa một số, nên phải so theo bit, không so bằng mắt được.

## IP header có gì?

| Trường             | Ý nghĩa                                                            |
| ------------------ | ------------------------------------------------------------------ |
| **Source IP**      | Địa chỉ người gửi                                                  |
| **Destination IP** | Địa chỉ người nhận                                                 |
| **TTL**            | Số chặng tối đa, mỗi router trừ 1, về 0 thì hủy (chống lặp vô hạn) |
| **Protocol**       | Gói bên trong là TCP (6), UDP (17) hay ICMP (1)                    |

## IP public, IP private và NAT

Lúc đầu mọi IP đều là public. Khi địa chỉ sắp cạn (thập niên 1990), người ta thêm **private IP và NAT** (RFC 1918) để dùng lại địa chỉ.

|                              | **Public**                   | **Private**                 |
| ---------------------------- | ---------------------------- | --------------------------- |
| Duy nhất toàn cầu            | Có                           | Không (dùng lại ở mọi mạng) |
| Người ngoài kết nối tới được | Được (nếu firewall cho phép) | Không trực tiếp             |
| Dùng cho                     | Server phục vụ bên ngoài     | Máy nội bộ, container       |

Ba dải private:

| Dải                                 | CIDR             | Thường gặp ở   |
| ----------------------------------- | ---------------- | -------------- |
| `10.0.0.0` đến `10.255.255.255`     | `10.0.0.0/8`     | Công ty, cloud |
| `172.16.0.0` đến `172.31.255.255`   | `172.16.0.0/12`  | **Docker**     |
| `192.168.0.0` đến `192.168.255.255` | `192.168.0.0/16` | Wi-Fi gia đình |

"Private" chỉ là quy ước: router trên Internet không chuyển tiếp các dải này ra ngoài. Nó **không đồng nghĩa với bảo mật**.

**NAT:** router thay IP nguồn private bằng IP public của nó khi gói đi ra, và dịch ngược khi gói trả về. Nhiều máy dùng chung một IP public.

Địa chỉ đặc biệt: `127.0.0.1` (localhost), `169.254.x.x` (tự gán khi không có DHCP), `0.0.0.0` (mọi địa chỉ).

## Ý nghĩa thực tế của network và host

1. **Cho biết hai máy có "thấy nhau trực tiếp" không.** Ba số đầu giống nhau thì cùng mạng, máy A gửi thẳng cho máy B qua switch. Ba số đầu khác nhau thì khác mạng, A phải đưa gói cho **gateway**. Đây là nền tảng của **routing**.
2. **Router chỉ cần nhớ "khu", không cần nhớ từng máy.** Giống bưu điện chỉ cần biết "thư gửi phố X thì chuyển bưu cục X". Nhờ vậy Internet mới mở rộng được.
3. **Chia mạng thành nhóm riêng.** Mỗi nhóm có quy tắc firewall riêng, và chỉ cần nhìn 3 số đầu là biết máy thuộc nhóm nào.

| Mạng đích     | Gửi đi đâu  |
| ------------- | ----------- |
| `192.168.1.x` | cổng A      |
| `192.168.2.x` | cổng B      |
| mọi nơi khác  | ra Internet |

| Mạng       | Dùng cho      |
| ---------- | ------------- |
| `10.0.1.x` | Phòng dev     |
| `10.0.2.x` | Phòng kế toán |
| `10.0.3.x` | Server        |

![Hai mạng 192.168.1.0/24 và 192.168.2.0/24 nối qua một router: máy A gửi máy B qua switch, máy A gửi máy D phải đi qua router](../../../assets/knowledge/networking/same-vs-different-network.png)

- **Máy A gửi máy B:** cả hai có 3 số đầu `192.168.1`, nên cùng mạng. Gói tin đi thẳng qua switch, không cần router.
- **Máy A gửi máy D:** A là `192.168.1.x`, D là `192.168.2.x`, khác mạng. A phải đưa gói cho **gateway** (router), rồi router chuyển sang mạng bên kia.

## FTP

**FTP** là cách **gửi file qua lại giữa máy bạn và server**. Giống gửi hàng đến kho: bạn đến cửa kho, nói tên và mật khẩu, rồi đưa hàng vào hoặc lấy hàng ra.

FTP dùng **hai kết nối riêng**:

| Đường dây         | Port      | Dùng để làm gì                                                                    |
| ----------------- | --------- | --------------------------------------------------------------------------------- |
| **Đường lệnh**    | 21        | Nói chuyện: "tôi là admin", "cho tôi xem danh sách file", "tôi muốn gửi file này" |
| **Đường dữ liệu** | Port khác | Chở file thật sự                                                                  |

Ở kho hàng: **đường lệnh** là bạn nói chuyện với nhân viên ở quầy, còn **đường dữ liệu** là băng chuyền chở hàng. Mỗi lần gửi hoặc nhận file, FTP mở một băng chuyền mới, xong thì đóng.

### Ai mở băng chuyền?

- **Active (chủ động):** server mở băng chuyền ngược về máy bạn. Máy bạn thường nằm sau router (NAT) nên bị chặn, giống người lạ gõ cửa thì bạn không mở. Ngày nay ít dùng.
- **Passive (thụ động):** server nói "hãy nối vào port 50000 của tôi", rồi **bạn chủ động nối vào**. Đi ra ngoài thì router luôn cho qua. Đây là mặc định hiện nay.

> Cái giá của passive: server phải **mở sẵn một dải port** (ví dụ 50000 đến 50100) trong firewall để nhận các băng chuyền đó.

### FTP không mã hóa, nên có FTPS

**FTPS** là **FTP cộng TLS**. Vẫn là FTP, vẫn hai đường dây như cũ, nhưng mọi thứ được **mã hóa**. Giống đổi từ **bưu thiếp** sang **phong bì dán kín có khóa**. Cùng ý tưởng như HTTP lên HTTPS.

```text
FTP :  FTP -> TCP -> IP
FTPS:  FTP -> TLS -> TCP -> IP     (thêm lớp TLS)
```

|          | **Explicit** (nên dùng)                                                  | **Implicit** (cũ)                          |
| -------- | ------------------------------------------------------------------------ | ------------------------------------------ |
| Port     | 21                                                                       | 990                                        |
| Cách làm | Nối vào như FTP thường, rồi gửi lệnh `AUTH TLS` để "nâng cấp" lên mã hóa | Mã hóa ngay từ đầu, không có bước nâng cấp |

**Explicit** là gõ cửa bình thường rồi nói "ta nói chuyện kín nhé". **Implicit** là vào cửa bắt buộc phải nói chuyện kín ngay.

FTPS vẫn còn một điểm khó chịu: firewall thường "đọc lén" đường lệnh để biết port băng chuyền nào cần mở. Khi đường lệnh đã mã hóa, firewall **đọc không được** nên không tự mở port. Cách giải quyết: **tự cố định dải port passive** trên server (ví dụ 50000 đến 50100) và **mở đúng dải đó** trong firewall.

### Chọn FTP, FTPS hay SFTP?

|              | FTP            | FTPS           | SFTP   |
| ------------ | -------------- | -------------- | ------ |
| Mã hóa       | Không          | Có             | Có     |
| Số đường dây | 2              | 2              | **1**  |
| Port         | 21 + port data | 21 + port data | **22** |
| Firewall     | Phiền          | Phiền          | **Dễ** |

**SFTP không phải FTP có thêm bảo mật.** Tên giống nhau nhưng là giao thức khác hoàn toàn, chạy trên SSH.

- **Việc mới:** dùng **SFTP** (hoặc rsync qua SSH). Mọi VPS đều có sẵn SSH.
- **Hệ thống cũ bắt buộc FTP:** dùng **FTPS Explicit**.
- **FTP thuần:** tránh dùng qua Internet.
- **Deploy backend hiện đại:** không cần FTP, dùng Docker image và registry.

## Docker network: cô lập và cầu nối

Mỗi Docker network là **một mạng riêng với dải IP riêng**, giống hai tòa nhà khác nhau. Mặc định Docker chia mỗi network theo `/16`, nên phần network là **2 số đầu** (`172.17`, `172.18`...):

| Network           | Dải             | Container                     |
| ----------------- | --------------- | ----------------------------- |
| `bridge` mặc định | `172.17.0.0/16` | `172.17.0.2`, `172.17.0.3`... |
| network `app_net` | `172.18.0.0/16` | `172.18.0.2`, `172.18.0.3`... |

```text
Network "app_net"  172.18.0.0/16        Network "other_net"  172.19.0.0/16
  api       172.18.0.2                    worker   172.19.0.2
  postgres  172.18.0.3                    redis    172.19.0.3
```

- `api` và `postgres` **cùng network**, nên gọi nhau được, kể cả bằng tên (`postgres`).
- `api` và `redis` **khác network**, nên mặc định **không thấy nhau**.

**Cô lập là do Docker chặn.** Khác dải IP không tự động có nghĩa là không nói chuyện được: hai mạng `192.168.1.x` và `192.168.2.x` ở trên vẫn nói chuyện qua router. Docker chặn vì **chủ động đặt luật firewall (iptables)** để các network cô lập nhau. Nên chính xác là:

1. Khác network nghĩa là khác dải IP, muốn nói chuyện phải đi qua router (máy host).
2. Docker **cố tình chặn** đường đó bằng luật iptables.
3. Kết quả: mặc định không nói chuyện được. Đây là sự cô lập có chủ đích, không phải tác dụng phụ của việc khác IP.

**DNS theo tên.** Với network do bạn tự tạo (và mọi network của Compose), Docker có **DNS nội bộ**: container gọi nhau bằng **tên**. DNS này chỉ phục vụ trong **cùng một network**, nên container ở network khác sẽ gặp lỗi `could not translate host name "postgres"`.

Muốn hai container ở network khác nhau nói chuyện, có ba cách:

| Cách                      | Làm gì                                                          |
| ------------------------- | --------------------------------------------------------------- |
| **Đặt chung network**     | Cách đơn giản nhất và hay dùng nhất                             |
| **Gắn vào nhiều network** | Một container tham gia cả hai network, như một "cầu nối"        |
| **Đi qua port ra host**   | Map port ra ngoài rồi gọi bằng IP host (ít nên làm, mất cô lập) |

## Compose: API làm cầu nối

API vừa gọi database vừa phục vụ Nginx:

```yaml
services:
  nginx:
    networks: [frontend]
  api:
    networks: [frontend, backend] # nằm ở cả hai
  postgres:
    networks: [backend] # chỉ trong backend

networks:
  frontend:
  backend:
```

![Network frontend chứa nginx, network backend chứa postgres, api nằm ở vùng chồng của cả hai; nginx gọi thẳng postgres thì bị chặn](../../../assets/knowledge/networking/docker-frontend-backend.png)

- **Khung tím đứt nét** là network `frontend`, **khung xanh lục đứt nét** là network `backend`. Hai khung chồng lên nhau ở giữa, và `api` nằm trong vùng chồng đó.
- **nginx** chỉ ở `frontend`, **postgres** chỉ ở `backend`. Hai thứ này không chung network nào.
- **api** thuộc cả hai network nên có **2 địa chỉ IP** (một ở mỗi bên). Nó là cầu nối: nginx gọi được api, api gọi được postgres.
- **Mũi tên đỏ đứt nét:** nginx gọi thẳng postgres thì bị chặn. Muốn tới postgres phải đi qua api.

Đó là cách bảo mật thực tế: database không lộ ra những thứ không cần.

## Tự kiểm tra khi học Docker

```bash
docker network ls                      # liệt kê các network
docker network inspect app_net         # xem dải IP và container nào đang tham gia
docker exec api ping postgres          # thử gọi theo tên từ trong container
```

Khi gặp `Connection refused` hoặc không phân giải được tên, việc đầu tiên là chạy `docker network inspect` và xem hai container có **nằm trong cùng một network** không.

## Bài tập: `10.0.5.130/24`

1. Mấy bit network, mấy bit host?
2. Network address và broadcast address là gì?
3. `10.0.6.20` có cùng mạng không?

<details>
<summary>Câu trả lời của tôi</summary>

1. Số bit network: 24. Số bit host: 8.
2. Network address: `10.0.5.0`. Broadcast address: `10.0.5.255`.
3. Không cùng mạng, vì network address của `10.0.6.20` là `10.0.6.0`, khác `10.0.5.0`.

</details>

## Bài tập: FTP trong Docker

Server FTP trên VPS (IP public `203.0.113.10`) chạy trong Docker, và nó trả lời client là "hãy nối vào `172.17.0.2`, port 50000". Vì sao client ở nhà không nối được?

<details>
<summary>Đáp án</summary>

`172.17.0.2` là địa chỉ **private** (thuộc dải `172.16.0.0/12` của Docker) và chỉ có ý nghĩa **bên trong** mạng Docker của VPS. Máy ở nhà không kết nối tới được, vì router trên Internet không định tuyến dải private.

Ở passive mode, server trả lời lệnh `PASV` bằng chính IP mà nó tự thấy ở card mạng của mình. Server nằm trong container nên chỉ thấy `172.17.0.2` và báo luôn địa chỉ đó cho client. Client nhận địa chỉ không đến được nên kênh dữ liệu thất bại: đăng nhập qua port 21 vẫn được, nhưng liệt kê thư mục hoặc tải file thì treo.

Cách sửa:

1. Khai báo IP public của VPS cho server FTP (vsftpd: `pasv_address=203.0.113.10`) để nó báo đúng địa chỉ cho client.
2. Cố định dải port passive (`pasv_min_port=50000`, `pasv_max_port=50100`).
3. Map đúng dải đó từ Docker ra host: `-p 21:21 -p 50000-50100:50000-50100`, và mở các port này trong firewall của VPS.

</details>

## Bài học rút ra

|                          | Ý nghĩa                         |
| ------------------------ | ------------------------------- |
| **3 số đầu** (với `/24`) | Máy thuộc mạng nào              |
| **Số cuối**              | Máy nào trong mạng đó           |
| Giống nhau               | Cùng mạng, nói chuyện trực tiếp |
| Khác nhau                | Khác mạng, phải qua router      |

- Lỗi mạng thì kiểm tra từng tầng từ dưới lên: cùng mạng chưa, đúng port chưa, firewall có mở không.
- Private IP chỉ có nghĩa trong mạng của nó. Đưa IP private cho client bên ngoài (như lệnh `PASV` trong container) là lỗi kinh điển.
- Việc mới thì chọn SFTP, không dùng FTP thuần qua Internet.
- Container không gọi được nhau thì việc đầu tiên là `docker network inspect`: chúng có cùng network không.

## Tài liệu tham khảo

- [RFC 791: Internet Protocol](https://www.rfc-editor.org/rfc/rfc791)
- [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918)
