# Wave-Recording-Simulator

Teorema Nyquist menyatakan bahwa frequensi sampling minimal adalah 2 kali frekuensi tertinggi dari frekuensi sinyal analog yang akan disampling. Hal ini untuk mencegah terjadinya aliasing.

Aliasing dalam hal ini adalah bergesernya frekuensi dari tinggi menjadi rendah akibat kesalahan pemilihan frekuensi sampling.

Sebagai contoh adalah ketika frekuensi sampling adalah 1,8 kali frekuensi sinyal informasi. Maka frekuensi sinyal hasil sampling akan bergeser menjadi kurang dari sepertiganya.

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

Untuk menjalankan simulator, silakan download versi 1.0.0 https://github.com/kamshory/Wave-Recording-Simulator/archive/1.0.0.zip

Extract file tersebut kemudian buka file index.html menggunakan browser. Silakan ubah Sampling Ratio dan Analog Phase. Perhatikan gambar yang ditampilkan.

