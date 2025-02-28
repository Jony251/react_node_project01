-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 28, 2025 at 01:27 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gamedatabase`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role` int(11) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role`, `username`, `email`, `password`) VALUES
(1, NULL, 'Alice Johnson', 'alice@example.com', '$2b$10$eDnMWhlrkNg4jXIwN24vhuyVCO2NNaGFD4LWEElwrQ9sMaM.7M62W'),
(2, NULL, 'Bob Smith', 'bob@example.com', '$2b$10$eDnMWhlrkNg4jXIwN24vhuyVCO2NNaGFD4LWEElwrQ9sMaM.7M62W'),
(3, NULL, 'Charlie Davis', 'charlie@example.com', '$2b$10$eDnMWhlrkNg4jXIwN24vhuyVCO2NNaGFD4LWEElwrQ9sMaM.7M62W'),
(4, NULL, 'David White', 'david@example.com', '$2b$10$eDnMWhlrkNg4jXIwN24vhuyVCO2NNaGFD4LWEElwrQ9sMaM.7M62W'),
(5, NULL, 'Eve Adams', 'eve@example.com', '$2b$10$eDnMWhlrkNg4jXIwN24vhuyVCO2NNaGFD4LWEElwrQ9sMaM.7M62W'),
(6, NULL, 'Frank Miller', 'frank@example.com', '$2b$10$eDnMWhlrkNg4jXIwN24vhuyVCO2NNaGFD4LWEElwrQ9sMaM.7M62W'),
(7, NULL, 'Grace Wilson', 'grace@example.com', '$2b$10$eDnMWhlrkNg4jXIwN24vhuyVCO2NNaGFD4LWEElwrQ9sMaM.7M62W'),
(8, NULL, 'Henry Brown', 'henry@example.com', '$2b$10$eDnMWhlrkNg4jXIwN24vhuyVCO2NNaGFD4LWEElwrQ9sMaM.7M62W'),
(9, NULL, 'Isabel Scott', 'isabel@example.com', '$2b$10$eDnMWhlrkNg4jXIwN24vhuyVCO2NNaGFD4LWEElwrQ9sMaM.7M62W'),
(10, NULL, 'Jack Lee', 'jack@example.com', '$2b$10$eDnMWhlrkNg4jXIwN24vhuyVCO2NNaGFD4LWEElwrQ9sMaM.7M62W'),
(11, NULL, 'Evgen', 'qwerty12@gmail.com', '$2b$10$eDnMWhlrkNg4jXIwN24vhuyVCO2NNaGFD4LWEElwrQ9sMaM.7M62W'),
(12, 1, 'Evgeny', 'jony90@live.ru', '$2b$10$.s2QW/9GPvghd1COGJcziu07MIvehyIjA9/P84.tip7/NaadN1FYS'),
(13, NULL, 'Ugeny', 'Exemple@gmial.com', '$2b$10$UTQvas/rEg2xg2MPREWBcuM.xCpqSqLWnF95asoLAhUDr97dQCmKW'),
(14, 0, 'test', 'test@test.com', '$2b$10$nTZ76OQwjG8BQYgLMxGgm.izwMmSlVrFyE30vOvLmuuD62FkEadaC');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
