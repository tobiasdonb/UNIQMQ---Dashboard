-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Waktu pembuatan: 08 Jan 2026 pada 09.16
-- Versi server: 10.4.14-MariaDB
-- Versi PHP: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `unimq`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `device`
--

CREATE TABLE `device` (
  `device_id` int(10) NOT NULL,
  `broker_url` varchar(500) NOT NULL,
  `mq_pass` varchar(20) DEFAULT NULL,
  `mq_user` varchar(20) DEFAULT NULL,
  `device_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `device`
--

INSERT INTO `device` (`device_id`, `broker_url`, `mq_pass`, `mq_user`, `device_type`) VALUES
(0, '', 'pdk2025', 'pdk', 'esp32-inkubator'),
(0, 'broker.hivemq.com', '', '', 'esp32-inkubator'),
(0, 'oojeojwesf.vom', '123', 'kontol', 'esp32-inkubator');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `user_id` int(10) NOT NULL,
  `user_name` varchar(20) NOT NULL,
  `password` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`user_id`, `user_name`, `password`) VALUES
(7, 'messi', '$2y$10$7NQnMnIhGj3qWyDa5.Dtp.2iu5Xu5qWv3erRRHKTKqA6QA.MApSs.'),
(8, 'Novi', '$2y$10$KsGVYuM.K6qzemkkiNAX5eFqlA33Llq4rdhycMJH4p76DeQWsVXtq'),
(9, 'wil', '$2y$10$KZEgap6TuDMmH8LCd3dIjem3tBtU.Yya0QCz4Cv.MwQBugy1zXURC'),
(10, 'parmita', '$2y$10$9IMp3jbBDJhpLEYJN1BsvOPk3ZNotLmrmBazM/s6nJ71MxLUZHaS2');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
