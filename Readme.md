# Full Stack Social Media Platform

Bu proje, AWS servislerinin nasıl kullanıldığını, hangi servislerin ne amaçla seçildiğini ve gerekli yapılandırmaların nasıl yapıldığını öğrenmek amacıyla geliştirilmiş bir sosyal medya platformudur.

---

## 🚀 Kullanılan Teknolojiler

- [Amazon Web Services (DevOps & Infrastructure)](#infrastructure)
- [FastAPI (Backend)](#backend)
- [Next.js (Frontend)](#frontend)

---

<a id="infrastructure"></a>

## 🏗️ AWS Servis Yönetimi (`infrastructure` Klasörü)
`infrastructure` klasörü içerisinde AWS üzerinde kullanılacak servislerin tanımları yapılır.

Bu katmanda:

- Hangi AWS servislerinin kullanılacağı
- Servislerin izin (IAM) yapılandırmaları
- CORS ayarları
- Servis isimlendirmeleri
- Genel cloud mimarisi konfigürasyonu

kod üzerinden yönetilir.

Tüm yapılandırmalar tamamlandıktan sonra AWS CDK kullanılarak AWS ortamına deploy edilir.

---

## ⚙️ Deploy Öncesi Yapılması Gerekenler

AWS ortamına deploy yapmadan önce aşağıdaki adımları tamamlamanız gerekir:

### 1. IAM User Oluşturma

AWS Console üzerinden IAM kullanıcı oluşturmak için:

👉 https://us-east-1.console.aws.amazon.com/iam/home?region=eu-central-1#/users

Adımlar:

1. **User name** kısmına istediğiniz kullanıcı adını girin ve devam edin.
2. **Permissions options** bölümünde:
   - `Attach policies directly` seçeneğini seçin
   - `AdministratorAccess` policy’sini ekleyin
3. Son adımda bilgileri kontrol edip **Create User** butonuna basın.

✔️ Bu adımlardan sonra IAM kullanıcı oluşturulmuş olur.

---

### 2. IAM User Keylerini Almak

Bu aşamda IAM User Keylerini alarak ilerleyen aşamalarda bilgisayar terminali üzerinden gerkeli konfigurasyonları yapıcaz.

Adımlar: 
1. Sol menüden [**IAM users**](https://us-east-1.console.aws.amazon.com/iam/home?region=eu-central-1#/users) sekmesine gidin ve oradan oluşturduğunuz IAM User ı seçin.
2. **Security credentials** Sekmesinde aşağıda bulunan `Create Access Key` kısmından bir key üretin
     - Use Case Seçeneği `Command Line Interface (CLI)` olmalı
3. Son ekranda karşınıza çıkan `Access key` ve `Secret access key`lerini  bir yere kaydedin(`Secret access key` değerini kaydetmezseniz tekrar ulaşamazsınız)

### 3. AWS CLI ve AWS CDK Kurulumu

AWS servislerini terminal üzerinden yönetebilmek için AWS CLI ve AWS CDK kurulmalıdır.

#### AWS CLI Kurulumu

Araştımak İstyene Kurulum dökümanı:

👉 https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

Kurulum kontrolü:

```bash
aws --version
```

---

#### AWS CDK Kurulumu

```bash
npm install -g aws-cdk
```

Kurulum kontrolü:

```bash
cdk --version
```

---

#### AWS CLI Konfigürasyonu

AWS hesabını terminale bağlamak için:

```bash
aws configure
```

Bu aşamada sizden şu bilgiler istenir:

- AWS Access Key ID
- AWS Secret Access Key
- Default region name
- Default output format

Örnek region:

```bash
eu-central-1
```

Örnek output format:

```bash
json
```

---

#### CDK Bootstrap

İlk deploy işlemi öncesinde aşağıdaki komut çalıştırılmalıdır:

```bash
cdk bootstrap
```

### 4. Infrastructure Deploy

Tüm kurulumlar tamamlandıktan sonra AWS servislerini deploy etmek için aşağıdaki komut çalıştırılmalıdır:

```bash
cd infrastructure && cdk deploy --all
```

Bu komut, CDK içerisinde tanımlanan tüm stack’leri AWS ortamına deploy eder.

Deploy işlemi sırasında:
- Oluşturulacak servisler listelenir
- IAM izinleri gösterilir
- Kullanıcı onayı istenir

Onay verildikten sonra AWS kaynakları oluşturulmaya başlanır.


<a id="backend"></a>

## 🏗️ Backend


<a id="frontend"></a>

## 🏗️ Frontend
