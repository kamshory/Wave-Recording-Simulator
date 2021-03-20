# Wave-Recording-Simulator

Teorema Nyquist menyatakan bahwa frequensi sampling minimal adalah 2 kali frekuensi tertinggi dari frekuensi sinyal analog yang akan disampling. Hal ini untuk mencegah terjadinya aliasing.

Aliasing dalam hal ini adalah bergesernya frekuensi dari tinggi menjadi rendah akibat kesalahan pemilihan frekuensi sampling.

Sebagai contoh adalah ketika frekuensi sampling adalah 1,28 kali frekuensi sinyal informasi. Maka frekuensi sinyal hasil sampling akan bergeser menjadi kurang dari sepertiganya.

![enter image description here](https://raw.githubusercontent.com/kamshory/Wave-Recording-Simulator/main/image001.png)

Teorema Nyquist bukanlah mutlak untuk aplikasi. Pada praktiknya, teorema ini hanya berlaku apabila sampling dilakukan pada puncak dan lembah gelombang. Pergeseran fasa akan berakibat pada amplituda sinyal hasil sampling. Bahkan, apabila sampling dilakukan pada level sinyal yang rendah akan berakibat pada hilangnya informasi.

![enter image description here](https://raw.githubusercontent.com/kamshory/Wave-Recording-Simulator/main/image002.png)

Gambar di atas memperlihatkan kondisi ideal. Sampling dilakukan pada setiap puncak dan lembah sinyal. Dalam hal ini, sinyal analog yang sisampling adalah cos(x) atau sin(x+90). 

![enter image description here](https://raw.githubusercontent.com/kamshory/Wave-Recording-Simulator/main/image003.png)

Ketika fasa sinyal bergeser menjadi sin(x+10), hasil sampling akan kehilangan amplituda sinyal. Anehnya, fasa dari sinyal hasil sampling tidak mengikuti fasa sinyal informasi namun justru mengikuti fasa dari penyampling. Ini tentu saja akan mengubah informasi sesungguhnya dari sinyal yang disampling.

![enter image description here](https://raw.githubusercontent.com/kamshory/Wave-Recording-Simulator/main/image004.png)

Pada ketika fase sinyal bergeser menjadi sin(x+0), hasil sampling akan kehilangan semua informasi sinyal baik frekuensi, fasa, maupun amplitude sinyal.
 
![enter image description here](https://raw.githubusercontent.com/kamshory/Wave-Recording-Simulator/main/image005.png)

Ketika frekuensi sampling atau sampling rate dinaikkan menjadi 3 kali frekuensi informasi, fasa dari sinyal hasil sampling akan mengikuti fasa sinyal informasi, meskipun terjadi sedikit pergeseran. Selain itu, frekuensi sinyal hasil sampling juga akan mengikuti frekuensi sinyal asli.

![enter image description here](https://raw.githubusercontent.com/kamshory/Wave-Recording-Simulator/main/image006.png)

Ketika frekuensi sampling dinaikkan menjadi 4 kali frekuensi informasi, sinyal hasil sampling akan lebih mendekati sinyal informasi.

![enter image description here](https://raw.githubusercontent.com/kamshory/Wave-Recording-Simulator/main/image007.png) 

Ketika fasa sinyal informasi digeser, fasa sinyal hasil sampling akan bergeser mengikuti pergeseran sinyal informasi. Sinyal hasil sampling tidak akan kehilangan amplituda dengan pergeseran fasa sinyal informasi sejauh apapun. Ini sangat berbeda dengan ketika frekuensi sampling sebesar 2 kali frekuensi sinyal informasi.

Ketika frekuensi sampling dinaikkan menjadi 8 kali frekuensi informasi, bentuk sinyal hasil sampling akan lebih mendekati sinyal asli.

![enter image description here](https://raw.githubusercontent.com/kamshory/Wave-Recording-Simulator/main/image008.png)

Kesimpulan dari percobaan ini adalah: Teorema Nyiquist menyatakan bahwa frekuensi sampling minimal adalah 2 kali frekuensi tertinggi dari sinyal informasi untuk menghindari terjadinya aliasing. Rasio 2 kali ini bukanlah untuk menentukan frekuensi ideal yang dapat digunakan untuk menyampling sinyal informasi karena pada kenyataannya, fasa dari sinyal informasi tidak dapat dikendalikan oleh penyampling. Frekuensi sampling sebesar 4 kali frekuensi sinyal informasi dapat dipilih sebagai pilihan terburuk. Untuk mendapatkan hasil yang lebih baik, gunakan frekuensi sampling yang lebih tinggi.

Untuk menjalankan simulator, silakan download versi 4.0.0 https://github.com/kamshory/Wave-Recording-Simulator/archive/4.0.0.zip

Extract file tersebut kemudian buka file index.html menggunakan browser. Silakan ubah Sampling Ratio dan Analog Phase. Perhatikan gambar yang ditampilkan.

Frekuensi tertinggi tergantung dari sumber suara. Sebagai contoh, pada perekaman musik, frekuensi tertinggi dinetukan oleh instrumen apa saja yang akan direkam dan tergantung penyanyinya.

Octávio Inácio pada ResearchGate dengan laman https://www.researchgate.net/figure/Frequency-ranges-of-several-musical-instruments-30_fig3_228446442 (diakses tanggal 28 Januari 2021) memperlihatkan frekuensi fundamental dan harmonik beberapa alat musik termasuk suara pria dan wanita. Frekuensi yang harus diperhatikan adalah frekuensi fundamental. Anda dapat menentukan harmonik ke berapa yang akan direkam. 

Sebagai contoh: sebuah lagu dinyanyikan oleh penyanyi wanita diiringi oleh biola bass. Frekuensi fundamental tertinggi penyanyi wanita sekitar 3 kHz dan frekuensi fundamental tertinggi dari biola bass adalah 300 Hz. Dengan demikian, frekuensi fundamental tertinggi dari lagu tersebut adalah 3 kHz.

Jika Anda ingin merekam hingga harmonik ketiga, maka frekuensi tertinggi dari harmonik adalah 12 kHz. Dengan frekuensi sebesar 12 kHz, maka perekaman dengan sampling rate sebesar 48 kHz telah memenuhi 4 kali frekuensi tertinggi dari informasi yang akan direkam. Frekuensi fundamental tertinggi disampling dengan rasio 16 kali, harmonik pertama disampling dengan rasio 8 kali, harmonik kedua disampling dengan rasio 5,3 kali, sedangkan harmonik ketiga disampling dengan rasio 4 kali. Tentu saja, perekaman dengan sampling rate 192 kHz akan memberikan suara yang sangat baik namun akan menyebabkan ukuran file menjadi sangat besar.

