-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 03 Jan 2026 pada 16.08
-- Versi server: 8.0.37-cll-lve
-- Versi PHP: 8.1.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ccpxengi_gencok`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `admin`
--

CREATE TABLE `admin` (
  `id` int NOT NULL,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', '$2y$10$Ki/nEDzPrMCw7oY3nDTH4.U7VbZ0.5jNp9U0D9gvPrqmxY6KU0eQO', '2025-12-25 12:14:25.627', '2026-01-02 05:16:29.000');

-- --------------------------------------------------------

--
-- Struktur dari tabel `campaign`
--

CREATE TABLE `campaign` (
  `id` int NOT NULL,
  `network` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `urlTemplate` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `postbackEndpoint` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `offerName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `campaign`
--

INSERT INTO `campaign` (`id`, `network`, `urlTemplate`, `postbackEndpoint`, `offerName`, `createdAt`, `updatedAt`) VALUES
(11, 'Trafee', 'https://domain.com/c/xxxxx?subsource={sub_id}&track={click_id}', 'https://domain.com/api/postback.php?network=Trafee&click_id={track}&payout={sum}', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource={sub_id}', '2026-01-02 21:44:03.000', '2026-01-02 21:44:03.000'),
(14, 'Lospollos', 'https://domain.com/?u=xx&o=xx&t={sub_id}&cid={click_id}', 'https://domain.com/api/postback.php?network=Lospollos&click_id={cid}&payout={sum}', 'https://cyapbre.more-datinghub.com/wzvrd4r?s1={sub_id}&cid={click_id}', '2026-01-02 23:48:59.000', '2026-01-02 23:48:59.000');

-- --------------------------------------------------------

--
-- Struktur dari tabel `click`
--

CREATE TABLE `click` (
  `id` int NOT NULL,
  `linkId` int NOT NULL,
  `ip` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userAgent` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `click`
--

INSERT INTO `click` (`id`, `linkId`, `ip`, `country`, `userAgent`, `createdAt`) VALUES
(85, 196, '149.154.161.248', 'GB', 'TelegramBot (like TwitterBot)', '2026-01-02 22:01:48.000'),
(86, 196, '173.252.107.2', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:05:24.000'),
(87, 196, '173.252.107.26', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:05:28.000'),
(88, 196, '173.252.107.2', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:05:30.000'),
(89, 196, '173.252.107.19', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:05:53.000'),
(90, 196, '173.252.107.6', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:05:53.000'),
(91, 196, '69.171.234.18', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:05:53.000'),
(92, 196, '69.171.234.18', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:05:54.000'),
(93, 196, '69.171.230.19', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:05:54.000'),
(94, 196, '69.171.230.7', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:05:54.000'),
(95, 196, '69.171.231.113', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:06:02.000'),
(96, 196, '69.171.230.1', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:06:02.000'),
(97, 196, '69.171.249.112', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:11:02.000'),
(98, 196, '31.13.127.1', 'IE', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:11:03.000'),
(99, 196, '173.252.79.8', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:11:07.000'),
(100, 196, '69.171.234.8', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:12:50.000'),
(101, 196, '173.252.95.53', 'US', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-02 22:13:06.000'),
(102, 196, '173.252.127.32', 'US', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-02 22:13:06.000'),
(103, 196, '31.13.127.6', 'IE', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-02 22:13:08.000'),
(104, 196, '66.220.149.0', 'US', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-02 22:13:12.000'),
(105, 196, '69.63.189.36', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:13:41.000'),
(106, 196, '69.171.234.8', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:13:42.000'),
(107, 196, '69.171.249.18', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:13:45.000'),
(108, 196, '173.252.95.52', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:13:47.000'),
(109, 196, '69.63.184.18', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:13:56.000'),
(110, 196, '173.252.127.6', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:18:20.000'),
(111, 196, '173.252.127.63', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:18:21.000'),
(112, 196, '173.252.79.113', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:21:00.000'),
(113, 196, '173.252.83.9', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:21:01.000'),
(114, 196, '31.13.103.3', 'DK', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:21:02.000'),
(115, 196, '31.13.115.56', 'SE', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:21:02.000'),
(116, 196, '66.220.149.47', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:28:03.000'),
(117, 196, '66.220.149.10', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:28:06.000'),
(118, 196, '173.252.82.14', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:31:32.000'),
(119, 196, '173.252.82.22', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:31:35.000'),
(120, 196, '66.220.149.53', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:31:42.000'),
(121, 196, '173.252.107.24', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:31:42.000'),
(122, 196, '173.252.79.114', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:31:46.000'),
(123, 196, '173.252.82.16', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:32:30.000'),
(124, 196, '31.13.103.112', 'DK', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:32:30.000'),
(125, 196, '173.252.127.3', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:32:31.000'),
(126, 196, '173.252.82.112', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:33:36.000'),
(127, 196, '69.63.184.115', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:34:24.000'),
(128, 196, '173.252.127.11', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:35:20.000'),
(129, 196, '66.220.149.7', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:36:53.000'),
(130, 196, '173.252.107.5', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:36:54.000'),
(131, 196, '69.171.234.52', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:37:10.000'),
(132, 196, '173.252.87.35', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:37:20.000'),
(133, 196, '173.252.70.113', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:37:21.000'),
(134, 196, '173.252.83.116', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:37:49.000'),
(135, 196, '190.122.221.76', 'VE', 'Mozilla/5.0 (Linux; Android 14; J12 Build/UP1A.231005.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36[FBAN/EMA;FBLC/es_LA;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-02 22:38:29.000'),
(136, 196, '31.13.127.6', 'IE', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:42:00.000'),
(137, 196, '31.13.127.3', 'IE', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:42:03.000'),
(138, 196, '69.63.184.3', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:42:23.000'),
(139, 196, '167.108.0.76', 'UY', 'Mozilla/5.0 (Linux; Android 15; Z2469N Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-02 22:47:34.000'),
(140, 196, '174.239.113.252', 'US', 'Mozilla/5.0 (Linux; Android 15; moto g - 2025 Build/V1VK35.22-125; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-02 22:50:33.000'),
(141, 196, '173.252.87.0', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 22:50:37.000'),
(142, 196, '179.117.86.248', 'BR', 'Mozilla/5.0 (Linux; Android 15; moto g54 5G Build/V1TDS35H.83-20-5-7; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-02 22:51:48.000'),
(143, 196, '41.144.160.12', 'ZA', 'Mozilla/5.0 (Linux; Android 15; SM-A065F Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36[FBAN/EMA;FBLC/en_US;FBAV/488.0.0.10.107;FBCX/modulariab;]', '2026-01-02 22:56:35.000'),
(144, 196, '58.145.190.247', 'BD', 'Mozilla/5.0 (Linux; Android 13; itel A665L Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/142.0.7444.171 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-02 22:56:58.000'),
(145, 196, '69.171.231.10', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 23:00:06.000'),
(146, 196, '213.230.87.46', 'UZ', 'Mozilla/5.0 (Linux; Android 12; 220733SFG Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36[FBAN/EMA;FBLC/ru_RU;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-02 23:03:56.000'),
(147, 196, '197.186.2.34', 'TZ', 'Mozilla/5.0 (Linux; Android 16; SM-A065F Build/BP2A.250605.031.A3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.116 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-02 23:04:54.000'),
(148, 196, '197.186.2.34', 'TZ', 'Mozilla/5.0 (Linux; Android 16; SM-A065F Build/BP2A.250605.031.A3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.116 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-02 23:05:36.000'),
(149, 196, '174.201.153.228', 'US', 'Mozilla/5.0 (Linux; Android 16; Pixel 9 Build/BP3A.251105.015; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/142.0.7444.94 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/538.0.0.53.70;IABMV/1;]', '2026-01-02 23:06:00.000'),
(150, 206, '149.154.161.244', 'GB', 'TelegramBot (like TwitterBot)', '2026-01-02 23:07:45.000'),
(151, 204, '149.154.161.197', 'GB', 'TelegramBot (like TwitterBot)', '2026-01-02 23:08:00.000'),
(152, 204, '209.183.45.63', 'US', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22B91 [FBAN/FBIOS;FBAV/503.0.0.72.68;FBDV/iPhone11,4;FBMD/iPhone;FBSN/iOS;FBSV/18.3;FBSS/3;FBID/phone;FBLC/uk_UA;FBOP/5]', '2026-01-02 23:14:40.000'),
(153, 204, '188.118.237.245', 'AT', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22E200 [FBAN/FBIOS;FBAV/500.0.0.55.188;FBDV/iPhone14,5;FBMD/iPhone;FBSN/iOS;FBSV/18.4.1;FBSS/2;FBID/phone;FBLC/kk_KZ;FBOP/5]', '2026-01-02 23:14:40.000'),
(154, 206, '50.8.216.113', 'US', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22E252 Instagram 378.0.0.30.76 (iPhone13,3; iOS 18_4_1; en_US; en-US; scale=3.00; 1170x2532; 726576486; IABMV/1)', '2026-01-02 23:14:41.000'),
(155, 204, '200.52.66.62', 'MX', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22E200 [FBAN/FBIOS;FBAV/487.0.0.52.346;FBDV/iPhone13,2;FBMD/iPhone;FBSN/iOS;FBSV/18.5;FBSS/3;FBID/phone;FBLC/kk_KZ;FBOP/5]', '2026-01-02 23:14:43.000'),
(156, 204, '209.183.45.63', 'US', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22C65 [FBAN/FBIOS;FBAV/473.0.0.13.481;FBDV/iPhone15,2;FBMD/iPhone;FBSN/iOS;FBSV/18.5.1;FBSS/3;FBID/phone;FBLC/en_US;FBOP/5]', '2026-01-02 23:14:54.000'),
(157, 206, '201.135.4.27', 'MX', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22E200 [FBAN/FBIOS;FBAV/487.0.0.52.346;FBDV/iPhone13,2;FBMD/iPhone;FBSN/iOS;FBSV/18.5;FBSS/3;FBID/phone;FBLC/kk_KZ;FBOP/5]', '2026-01-02 23:15:08.000'),
(158, 204, '100.61.188.100', 'US', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22D502 [FBAN/FBIOS;FBAV/471.0.0.73.706;FBDV/iPhone14,2;FBMD/iPhone;FBSN/iOS;FBSV/18.4;FBSS/3;FBID/phone;FBLC/uk_UA;FBOP/5]', '2026-01-02 23:15:17.000'),
(159, 206, '62.95.87.200', 'SE', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22B91 [FBAN/FBIOS;FBAV/489.0.0.51.526;FBDV/iPhone17,3;FBMD/iPhone;FBSN/iOS;FBSV/18.5;FBSS/2;FBID/phone;FBLC/en_US;FBOP/5]', '2026-01-02 23:15:30.000'),
(160, 206, '101.118.184.134', 'AU', 'Mozilla/5.0 (Linux; Android 14; Xiaomi 14 Ultra Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/134.0.6998.135 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/504.0.0.69.64.111;IABMV/1;]', '2026-01-02 23:15:57.000'),
(161, 206, '90.141.64.173', 'SE', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:16:00.000'),
(162, 206, '175.37.139.41', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:16:01.000'),
(163, 206, '175.37.139.41', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:16:03.000'),
(164, 206, '90.141.64.173', 'SE', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:16:06.000'),
(165, 206, '175.37.139.41', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:16:10.000'),
(166, 206, '175.37.139.41', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:16:13.000'),
(167, 206, '120.18.16.49', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:16:15.000'),
(168, 206, '120.18.16.49', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:16:17.000'),
(169, 206, '175.37.139.41', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:16:20.000'),
(170, 206, '175.37.139.41', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:16:24.000'),
(171, 206, '120.18.16.49', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:16:26.000'),
(172, 196, '181.209.96.138', 'AR', 'Mozilla/5.0 (Linux; Android 14; moto e14 Build/ULBS34.66-110-1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.35 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-02 23:16:28.000'),
(173, 206, '175.37.139.41', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:16:31.000'),
(174, 206, '120.18.16.49', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:16:32.000'),
(175, 206, '175.37.139.41', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:16:34.000'),
(176, 206, '120.18.16.49', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:16:37.000'),
(177, 206, '175.37.139.41', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:16:41.000'),
(178, 206, '175.37.139.41', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:16:44.000'),
(179, 196, '181.209.96.138', 'AR', 'Mozilla/5.0 (Linux; Android 14; moto e14 Build/ULBS34.66-110-1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.35 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-02 23:16:58.000'),
(180, 204, '120.18.140.133', 'AU', 'Mozilla/5.0 (Linux; Android 15; SM-G991B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/134.0.6998.95 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/498.0.0.54.74.201;IABMV/1;]', '2026-01-02 23:17:05.000'),
(181, 206, '62.128.248.46', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:17:34.000'),
(182, 206, '62.128.248.46', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:17:38.000'),
(183, 206, '62.128.248.46', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:17:43.000'),
(184, 206, '62.128.248.46', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:17:49.000'),
(185, 204, '120.16.109.106', 'AU', 'Mozilla/5.0 (Linux; Android 15; SM-G991B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/134.0.6998.95 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/498.0.0.54.74.201;IABMV/1;]', '2026-01-02 23:17:54.000'),
(186, 206, '62.128.248.46', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:17:57.000'),
(187, 206, '62.128.248.46', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:03.000'),
(188, 206, '123.98.130.101', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:04.000'),
(189, 206, '123.98.130.101', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:06.000'),
(190, 206, '62.128.248.46', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:08.000'),
(191, 206, '123.98.130.101', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:11.000'),
(192, 206, '62.128.248.46', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:13.000'),
(193, 206, '123.98.130.101', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:13.000'),
(194, 206, '62.128.248.46', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:21.000'),
(195, 206, '123.98.130.101', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:22.000'),
(196, 196, '1.47.88.92', 'TH', 'Mozilla/5.0 (Linux; Android 15; RMX3938 Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/142.0.7444.102 Mobile Safari/537.36[FBAN/EMA;FBLC/th_TH;FBAV/480.0.0.9.107;FBCX/modulariab;]', '2026-01-02 23:18:25.000'),
(197, 206, '62.128.248.46', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:25.000'),
(198, 206, '123.98.130.101', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:28.000'),
(199, 206, '62.128.248.46', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:31.000'),
(200, 206, '123.98.130.101', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:33.000'),
(201, 206, '62.128.248.46', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:36.000'),
(202, 206, '123.98.130.101', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:38.000'),
(203, 206, '62.128.248.46', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:44.000'),
(204, 206, '123.98.130.101', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:45.000'),
(205, 206, '209.21.218.243', 'US', 'Mozilla/5.0 (Linux; Android 14; Mi MIX 4 Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.7049.60 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/502.0.0.66.79.81;]', '2026-01-02 23:18:46.000'),
(206, 206, '123.98.130.101', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:48.000'),
(207, 206, '62.128.248.46', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:50.000'),
(208, 206, '62.128.248.46', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:18:55.000'),
(209, 206, '62.128.248.46', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:19:00.000'),
(210, 204, '202.7.182.196', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:19:01.000'),
(211, 206, '202.7.182.196', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:19:05.000'),
(212, 206, '202.7.182.196', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:19:07.000'),
(213, 206, '62.128.248.46', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:19:08.000'),
(214, 206, '62.128.248.46', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:19:12.000'),
(215, 206, '202.7.182.196', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:19:13.000'),
(216, 206, '120.18.82.130', 'AU', 'Mozilla/5.0 (Linux; Android 15; Galaxy M51 Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.7049.60 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/502.0.0.66.79.81;IABMV/1;]', '2026-01-02 23:19:16.000'),
(217, 206, '202.7.182.196', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:19:16.000'),
(218, 206, '62.128.248.46', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:19:17.000'),
(219, 206, '202.7.182.196', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:19:22.000'),
(220, 206, '202.7.182.196', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:19:25.000'),
(221, 206, '202.7.182.196', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:19:31.000'),
(222, 206, '202.7.182.196', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:19:35.000'),
(223, 206, '202.7.182.196', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:19:42.000'),
(224, 206, '202.7.182.196', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:19:46.000'),
(225, 206, '120.17.84.123', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:20:07.000'),
(226, 206, '120.17.84.123', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:20:12.000'),
(227, 206, '120.17.84.123', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:20:20.000'),
(228, 206, '120.17.84.123', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:20:24.000'),
(229, 206, '203.12.214.123', 'AU', 'Mozilla/5.0 (Linux; Android 15; Galaxy A71 Build/MMB29T; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.7049.60 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/504.0.0.69.64.111;]', '2026-01-02 23:20:28.000'),
(230, 206, '120.17.84.123', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:20:31.000'),
(231, 206, '203.12.214.123', 'AU', 'Mozilla/5.0 (Linux; Android 15; Galaxy A71 Build/MMB29T; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.7049.60 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/504.0.0.69.64.111;]', '2026-01-02 23:20:35.000'),
(232, 206, '120.17.84.123', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:20:37.000'),
(233, 206, '195.121.86.202', 'NL', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:20:40.000'),
(234, 206, '120.17.84.123', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:20:40.000'),
(235, 206, '203.12.214.123', 'AU', 'Mozilla/5.0 (Linux; Android 15; Galaxy A71 Build/MMB29T; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.7049.60 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/504.0.0.69.64.111;]', '2026-01-02 23:20:40.000'),
(236, 206, '203.12.214.123', 'AU', 'Mozilla/5.0 (Linux; Android 15; Galaxy A71 Build/MMB29T; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.7049.60 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/504.0.0.69.64.111;]', '2026-01-02 23:20:48.000'),
(237, 206, '203.12.214.123', 'AU', 'Mozilla/5.0 (Linux; Android 15; Galaxy A71 Build/MMB29T; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.7049.60 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/504.0.0.69.64.111;]', '2026-01-02 23:20:53.000'),
(238, 206, '195.121.86.202', 'NL', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:20:54.000'),
(239, 206, '203.12.214.123', 'AU', 'Mozilla/5.0 (Linux; Android 15; Xiaomi 13 Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.7049.60 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/502.0.0.66.79.81;IABMV/1;]', '2026-01-02 23:21:00.000'),
(240, 204, '120.17.17.156', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:21:16.000'),
(241, 206, '120.17.17.156', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:21:19.000'),
(242, 206, '120.17.17.156', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:21:22.000'),
(243, 206, '120.17.17.156', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:21:28.000'),
(244, 206, '120.17.17.156', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:21:31.000'),
(245, 206, '120.17.17.156', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:21:37.000'),
(246, 206, '120.17.17.156', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:21:41.000'),
(247, 206, '120.17.17.156', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:21:48.000'),
(248, 206, '120.17.17.156', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:21:51.000'),
(249, 206, '120.17.17.156', 'AU', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:21:57.000'),
(250, 206, '178.232.189.220', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:21:59.000'),
(251, 206, '178.232.189.220', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:22:03.000'),
(252, 206, '178.232.189.220', 'NO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:22:09.000'),
(253, 206, '120.18.104.55', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:22:13.000'),
(254, 206, '120.18.104.55', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:22:20.000'),
(255, 206, '203.171.202.132', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:23:27.000'),
(256, 206, '203.171.202.132', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:23:29.000'),
(257, 206, '203.171.202.132', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:23:36.000'),
(258, 204, '203.14.48.137', 'AU', 'Mozilla/5.0 (Linux; Android 15; Xiaomi 12X Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/134.0.6998.108 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/504.0.0.69.64.111;]', '2026-01-02 23:23:36.000'),
(259, 206, '203.171.202.132', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:23:44.000'),
(260, 206, '203.171.202.132', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:23:50.000'),
(261, 206, '203.171.202.132', 'AU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:23:56.000'),
(262, 206, '216.51.52.80', 'US', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:26:22.000'),
(263, 206, '65.46.150.145', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:26:24.000'),
(264, 206, '66.94.31.107', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:26:36.000'),
(265, 206, '65.46.150.145', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:26:40.000'),
(266, 206, '66.94.31.107', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:26:41.000'),
(267, 206, '66.94.31.107', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:26:45.000'),
(268, 207, '149.154.161.219', 'GB', 'TelegramBot (like TwitterBot)', '2026-01-02 23:26:53.000'),
(269, 206, '66.94.31.107', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:27:04.000'),
(270, 206, '66.94.31.107', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:27:14.000'),
(271, 196, '69.63.189.51', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 23:27:23.000'),
(272, 206, '204.253.156.110', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:27:55.000'),
(273, 206, '204.253.156.110', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:28:00.000'),
(274, 206, '204.253.156.110', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:28:05.000'),
(275, 206, '204.253.156.110', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:28:15.000'),
(276, 204, '206.159.101.160', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:28:25.000'),
(277, 206, '204.253.156.110', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:28:33.000'),
(278, 206, '75.122.69.103', 'US', 'Mozilla/5.0 (Linux; Android 14; SM-F936B Build/TP1A.220905.004; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.7049.38 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/506.1.0.74.27.111;]', '2026-01-02 23:28:58.000'),
(279, 204, '71.22.20.101', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:29:51.000'),
(280, 206, '198.3.176.225', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:30:02.000'),
(281, 206, '207.176.164.97', 'US', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:30:09.000'),
(282, 206, '198.3.176.225', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:30:10.000'),
(283, 204, '71.22.20.101', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:30:10.000'),
(284, 206, '198.3.176.225', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:30:16.000'),
(285, 206, '207.176.164.97', 'US', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:30:20.000'),
(286, 206, '99.200.242.87', 'DE', 'Mozilla/5.0 (Linux; Android 14; SM-A546B Build/MMB29T; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/134.0.6998.135 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/504.0.0.69.64.111;IABMV/1;]', '2026-01-02 23:30:27.000'),
(287, 206, '198.3.176.225', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:30:27.000'),
(288, 206, '207.176.164.97', 'US', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:30:28.000'),
(289, 206, '198.3.176.225', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:30:32.000'),
(290, 206, '207.176.164.97', 'US', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:30:35.000'),
(291, 204, '199.202.235.218', 'CA', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:31:16.000'),
(292, 204, '192.30.14.15', 'CA', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:31:20.000'),
(293, 204, '192.30.14.15', 'CA', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:31:34.000'),
(294, 204, '71.22.46.140', 'US', 'Mozilla/5.0 (Linux; Android 14; Pixel 7 Pro Build/MMB29T; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.7049.60 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/506.1.0.74.27.111;IABMV/1;]', '2026-01-02 23:31:45.000'),
(295, 206, '172.54.129.145', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:32:17.000'),
(296, 204, '155.173.136.144', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:32:23.000'),
(297, 204, '216.203.156.151', 'US', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:32:26.000'),
(298, 204, '86.115.113.179', 'FI', 'Mozilla/5.0 (Linux; Android 15; Pixel 8 Build/TP1A.220905.004; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/134.0.6998.108 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/504.0.0.69.64.111;IABMV/1;]', '2026-01-02 23:32:35.000'),
(299, 206, '71.21.210.106', 'US', 'Mozilla/5.0 (Linux; Android 14; Galaxy M51 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/134.0.6998.135 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/502.0.0.66.79.81;IABMV/1;]', '2026-01-02 23:32:38.000'),
(300, 204, '216.203.156.151', 'US', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:32:39.000'),
(301, 204, '207.86.38.227', 'US', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:33:26.000'),
(302, 206, '130.5.30.56', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:33:36.000'),
(303, 206, '75.123.31.131', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:33:37.000'),
(304, 206, '75.123.31.131', 'US', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0 Waterfox/56.5', '2026-01-02 23:33:39.000'),
(305, 204, '207.86.38.227', 'US', 'Mozilla/5.0 (iPhone16; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/600.1.96', '2026-01-02 23:33:40.000'),
(306, 210, '149.154.161.231', 'GB', 'TelegramBot (like TwitterBot)', '2026-01-02 23:34:14.000'),
(307, 207, '66.175.209.32', 'US', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1', '2026-01-02 23:34:51.000'),
(308, 211, '216.24.210.16', 'US', 'WhatsApp/2.2587.9 W', '2026-01-02 23:34:57.000'),
(309, 196, '13.127.152.85', 'IN', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-02 23:35:12.000'),
(310, 196, '31.13.103.20', 'DK', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 23:36:49.000'),
(311, 210, '66.175.209.32', 'US', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1', '2026-01-02 23:37:37.000'),
(312, 211, '128.14.66.77', 'US', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-02 23:37:57.000'),
(313, 210, '66.175.209.32', 'US', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1', '2026-01-02 23:38:02.000'),
(314, 211, '128.14.66.77', 'US', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-02 23:38:11.000'),
(315, 196, '41.50.16.88', 'ZA', 'Mozilla/5.0 (Linux; Android 13; 21061119AG Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-02 23:38:41.000'),
(316, 196, '41.50.16.88', 'ZA', 'Mozilla/5.0 (Linux; Android 13; 21061119AG Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;] FBNV/500', '2026-01-02 23:38:42.000'),
(317, 211, '178.128.231.242', 'CA', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-02 23:40:19.000'),
(318, 211, '45.84.123.249', 'NL', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-02 23:42:52.000'),
(319, 196, '173.252.95.52', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 23:49:23.000'),
(320, 196, '103.87.212.87', 'BD', 'Mozilla/5.0 (Linux; Android 13; V2131 Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-02 23:50:09.000'),
(321, 196, '31.13.115.1', 'SE', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-02 23:59:17.000'),
(322, 212, '193.104.75.35', 'SG', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-03 00:12:12.000'),
(323, 196, '173.252.83.24', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 00:15:03.000'),
(324, 196, '69.171.234.55', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 00:15:52.000'),
(325, 196, '173.252.87.18', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 00:17:10.000'),
(326, 196, '173.252.87.42', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 00:17:10.000'),
(327, 196, '197.211.52.178', 'NG', 'Mozilla/5.0 (Linux; Android 11; itel A510W Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/141.0.7390.122 Mobile Safari/537.36[FBAN/EMA;FBLC/en_GB;FBAV/480.0.0.9.107;FBCX/modulariab;]', '2026-01-03 00:17:45.000'),
(328, 196, '213.139.44.133', 'JO', 'Mozilla/5.0 (Linux; Android 16; 2404ARN45A Build/BP2A.250605.031.A3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/541.0.0.85.79;IABMV/1;]', '2026-01-03 00:27:47.000'),
(329, 215, '23.251.121.201', 'US', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-03 00:30:54.000'),
(330, 196, '45.187.223.108', 'BR', 'Mozilla/5.0 (Linux; Android 12; SM-A025M Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 00:39:33.000'),
(331, 216, '23.251.121.201', 'US', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-03 00:40:33.000'),
(332, 216, '23.251.121.201', 'US', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-03 00:42:31.000'),
(333, 216, '23.251.121.201', 'US', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-03 00:43:20.000'),
(334, 216, '107.151.216.204', 'US', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-03 00:48:43.000'),
(335, 196, '49.49.233.99', 'TH', 'Mozilla/5.0 (Linux; Android 10; CPH2185 Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 00:52:21.000'),
(336, 217, '193.104.75.35', 'SG', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-03 00:52:38.000'),
(337, 196, '186.237.124.6', 'BR', 'Mozilla/5.0 (Linux; Android 7.1.2; LM-X210 Build/N2G47H; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.193 Mobile Safari/537.36[FBAN/EMA;FBLC/pt_BR;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-03 01:00:23.000'),
(338, 196, '200.95.218.106', 'BR', 'Mozilla/5.0 (Linux; Android 16; SM-A166M Build/BP2A.250605.031.A3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.58.73;IABMV/1;]', '2026-01-03 01:17:49.000'),
(339, 196, '69.171.231.25', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 01:25:13.000'),
(340, 196, '190.90.16.10', 'CO', 'Mozilla/5.0 (Linux; Android 14; TECNO BG6m Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36[FBAN/EMA;FBLC/es_LA;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-03 01:29:25.000'),
(341, 196, '69.63.184.3', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 01:41:26.000'),
(342, 196, '154.161.149.144', 'GH', 'Mozilla/5.0 (Linux; Android 13; SM-A042F Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/142.0.7444.102 Mobile Safari/537.36[FBAN/EMA;FBLC/en_GB;FBAV/488.0.0.10.107;FBCX/modulariab;]', '2026-01-03 01:43:43.000'),
(343, 196, '191.95.35.1', 'CO', 'Mozilla/5.0 (Linux; Android 14; Z2466 Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.35 Mobile Safari/537.36[FBAN/EMA;FBLC/en_US;FBAV/490.1.0.14.109;FBCX/modulariab;]', '2026-01-03 01:48:54.000'),
(344, 196, '179.102.141.124', 'BR', 'Mozilla/5.0 (Linux; Android 15; SM-A055M Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/142.0.7444.94 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/538.0.0.53.70;IABMV/1;]', '2026-01-03 01:50:51.000'),
(345, 196, '173.252.95.6', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 01:50:51.000'),
(346, 212, '193.104.75.35', 'SG', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-03 01:55:26.000'),
(347, 196, '3.111.32.125', 'IN', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-03 01:58:09.000'),
(348, 196, '69.171.234.54', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 01:58:53.000'),
(349, 196, '45.191.44.28', 'CO', 'Mozilla/5.0 (Linux; Android 15; SM-A165M Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 02:02:20.000'),
(350, 196, '177.54.199.92', 'BR', 'Mozilla/5.0 (Linux; Android 13; SM-A325M Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 02:06:28.000'),
(351, 196, '188.48.90.246', 'SA', 'Mozilla/5.0 (Linux; Android 11; V2043 Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 02:07:25.000'),
(352, 196, '181.176.107.63', 'PE', 'Mozilla/5.0 (Linux; Android 14; SM-A528B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/139.0.7258.90 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/526.1.0.66.75;IABMV/1;]', '2026-01-03 02:16:19.000'),
(353, 196, '102.157.219.214', 'TN', 'Mozilla/5.0 (Linux; Android 10; ART-L29 Build/HUAWEIART-L29; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.105 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/514.0.0.65.72;]', '2026-01-03 02:23:47.000'),
(354, 196, '31.13.127.4', 'IE', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 02:26:29.000'),
(355, 196, '66.220.149.1', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 02:26:40.000'),
(356, 196, '131.108.221.6', 'BR', 'Mozilla/5.0 (Linux; Android 15; 23053RN02L Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 02:27:07.000');
INSERT INTO `click` (`id`, `linkId`, `ip`, `country`, `userAgent`, `createdAt`) VALUES
(357, 196, '116.71.179.132', 'PK', 'Mozilla/5.0 (Linux; Android 11; TECNO LE6 Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.105 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/542.0.0.46.151;IABMV/1;]', '2026-01-03 02:30:35.000'),
(358, 196, '152.207.56.159', 'CU', 'Mozilla/5.0 (Linux; Android 12; ZTE Blade A53 Pro Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/125.0.6422.152 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/467.1.0.52.83;]', '2026-01-03 02:31:06.000'),
(359, 196, '160.164.143.82', 'MA', 'Mozilla/5.0 (Linux; Android 11; SM-A107F Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 02:41:15.000'),
(360, 196, '69.63.189.26', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 02:43:22.000'),
(361, 196, '69.171.249.9', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 02:50:15.000'),
(362, 196, '186.205.18.106', 'BR', 'Mozilla/5.0 (Linux; Android 15; moto g06 Build/VVOB35.78-71-1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 02:53:13.000'),
(363, 196, '197.46.176.20', 'EG', 'Mozilla/5.0 (Linux; Android 15; CPH2687 Build/AP3A.240617.008; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 02:53:14.000'),
(364, 196, '31.13.103.10', 'DK', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 02:53:26.000'),
(365, 196, '31.13.103.114', 'DK', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 02:53:26.000'),
(366, 196, '197.46.176.20', 'EG', 'Mozilla/5.0 (Linux; Android 15; CPH2687 Build/AP3A.240617.008; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 02:54:23.000'),
(367, 196, '41.200.124.158', 'DZ', 'Mozilla/5.0 (Linux; Android 12; SM-A135F Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36[FBAN/EMA;FBLC/az_AZ;FBAV/486.0.0.13.109;FBCX/modulariab;]', '2026-01-03 03:02:44.000'),
(368, 196, '186.1.130.64', 'CO', 'Mozilla/5.0 (Linux; Android 13; TECNO BG6 Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.146 Mobile Safari/537.36[FBAN/EMA;FBLC/es_LA;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-03 03:04:06.000'),
(369, 196, '109.224.242.36', 'TR', 'Mozilla/5.0 (Linux; Android 8.0.0; LDN-L21 Build/HUAWEILDN-L21; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/138.0.7204.179 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/276.0.0.44.127;]', '2026-01-03 03:04:55.000'),
(370, 196, '197.235.229.218', 'MZ', 'Mozilla/5.0 (Linux; Android 13; TECNO BG6 Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36[FBAN/EMA;FBLC/pt_PT;FBAV/491.0.0.7.112;FBCX/modulariab;]', '2026-01-03 03:16:28.000'),
(371, 196, '102.17.120.69', 'MG', 'Mozilla/5.0 (Linux; Android 14; 24117RN76G Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.115 Mobile Safari/537.36[FBAN/EMA;FBLC/fr_FR;FBAV/490.1.0.14.109;FBCX/modulariab;]', '2026-01-03 03:24:00.000'),
(372, 196, '69.171.249.118', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 03:24:07.000'),
(373, 196, '173.252.69.114', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 03:24:44.000'),
(374, 196, '173.252.69.113', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 03:24:44.000'),
(375, 196, '173.252.69.116', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 03:24:46.000'),
(376, 196, '66.220.149.8', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 03:24:50.000'),
(377, 196, '102.187.44.59', 'EG', 'Mozilla/5.0 (Linux; Android 15; Infinix X6728 Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 03:46:31.000'),
(378, 196, '191.59.106.235', 'BR', 'Mozilla/5.0 (Linux; Android 15; SM-A156M Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.146 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/540.0.0.49.148;IABMV/1;]', '2026-01-03 04:05:30.000'),
(379, 196, '105.35.195.92', 'EG', 'Mozilla/5.0 (Linux; Android 12; JAD-LX9 Build/HUAWEIJAD-L29; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/114.0.5735.196 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;]', '2026-01-03 04:14:12.000'),
(380, 196, '31.13.127.61', 'IE', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 04:15:15.000'),
(381, 196, '179.242.250.73', 'BR', 'Mozilla/5.0 (Linux; Android 10; SM-A920F Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 04:24:36.000'),
(382, 196, '196.137.195.64', 'EG', 'Mozilla/5.0 (Linux; Android 14; CPH2669 Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;] FBNV/500', '2026-01-03 04:27:11.000'),
(383, 196, '190.181.22.74', 'BO', 'Mozilla/5.0 (Linux; Android 11; motorola one fusion Build/RPLS31.Q2-63-10-2-9; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 04:28:27.000'),
(384, 196, '41.98.155.159', 'DZ', 'Mozilla/5.0 (Linux; Android 10; CPH1823 Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 04:39:31.000'),
(385, 196, '196.207.222.30', 'SN', 'Mozilla/5.0 (Linux; Android 16; SM-A075F Build/BP2A.250605.031.A3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36[FBAN/EMA;FBLC/fr_FR;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-03 05:28:41.000'),
(386, 196, '181.198.68.148', 'EC', 'Mozilla/5.0 (Linux; Android 13; TECNO KI7 Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.116 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/537.0.0.52.109;]', '2026-01-03 05:29:50.000'),
(387, 196, '102.88.108.171', 'NG', 'Mozilla/5.0 (Linux; Android 9; TECNO KB7j Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.116 Mobile Safari/537.36[FBAN/EMA;FBLC/en_US;FBAV/489.0.0.12.109;FBCX/modulariab;]', '2026-01-03 05:33:41.000'),
(388, 196, '102.88.108.171', 'NG', 'Mozilla/5.0 (Linux; Android 9; TECNO KB7j Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.116 Mobile Safari/537.36[FBAN/EMA;FBLC/en_US;FBAV/489.0.0.12.109;FBCX/modulariab;]', '2026-01-03 05:33:42.000'),
(389, 228, '195.216.243.153', 'RU', 'Mozilla/5.0 (Windows; U; Windows NT 5.1; ru; rv:1.9.1.5) Gecko/20091102 Firefox/3.5.5 GTB6', '2026-01-03 05:37:47.000'),
(390, 228, '107.155.57.95', 'US', 'WhatsApp/2.23.20.0', '2026-01-03 05:38:07.000'),
(391, 228, '69.171.230.9', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 05:38:51.000'),
(392, 228, '69.171.230.1', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 05:38:52.000'),
(393, 228, '173.252.127.6', 'US', 'Mozilla/5.0 (Linux; Android 12; 220733SG Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.146 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/537.0.0.52.109;]', '2026-01-03 05:38:56.000'),
(394, 196, '102.89.83.86', 'NG', 'Mozilla/5.0 (Linux; Android 11; TECNO CE7j Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36[FBAN/EMA;FBLC/en_US;FBAV/475.0.0.14.104;FBCX/modulariab;]', '2026-01-03 05:54:35.000'),
(395, 228, '167.99.191.106', 'CA', 'Mozilla/5.0 (Linux; Android 10; M2006C3MG Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.146 Mobile Safari/537.36 Instagram 410.1.0.63.71 Android (29/10; 320dpi; 720x1449; Xiaomi/Redmi; M2006C3MG; angelica; mt6765; in_ID; 846519222)', '2026-01-03 05:55:06.000'),
(396, 196, '186.237.124.6', 'BR', 'Mozilla/5.0 (Linux; Android 7.1.2; LM-X210 Build/N2G47H; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.193 Mobile Safari/537.36[FBAN/EMA;FBLC/pt_BR;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-03 06:02:40.000'),
(397, 228, '69.171.234.61', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 06:05:34.000'),
(398, 228, '69.171.234.18', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 06:05:40.000'),
(399, 228, '69.171.234.18', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 06:05:40.000'),
(400, 228, '69.171.234.3', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 06:05:43.000'),
(401, 228, '173.252.127.26', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 06:06:36.000'),
(402, 228, '69.63.189.43', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 06:06:54.000'),
(403, 228, '173.252.82.19', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 06:06:59.000'),
(404, 196, '173.252.87.4', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 06:07:12.000'),
(405, 228, '31.13.127.27', 'IE', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 06:10:47.000'),
(406, 228, '66.220.149.26', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 06:10:48.000'),
(407, 196, '187.212.150.15', 'MX', 'Mozilla/5.0 (Linux; Android 15; V2419 Build/AP3A.240905.015.A2_SCCS; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 06:10:50.000'),
(408, 196, '196.207.222.30', 'SN', 'Mozilla/5.0 (Linux; Android 16; SM-A075F Build/BP2A.250605.031.A3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36[FBAN/EMA;FBLC/fr_FR;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-03 06:21:26.000'),
(409, 196, '196.207.222.30', 'SN', 'Mozilla/5.0 (Linux; Android 16; SM-A075F Build/BP2A.250605.031.A3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36[FBAN/EMA;FBLC/fr_FR;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-03 06:21:47.000'),
(410, 196, '177.10.184.89', 'HN', 'Mozilla/5.0 (Linux; Android 12; TECNO BF6 Build/SP1A.210812.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.116 Mobile Safari/537.36[FBAN/EMA;FBLC/es_ES;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-03 06:28:13.000'),
(411, 196, '51.235.63.216', 'SA', 'Mozilla/5.0 (Linux; Android 14; 2409BRN2CY Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36[FBAN/EMA;FBLC/en_GB;FBAV/491.0.0.7.112;FBCX/modulariab;]', '2026-01-03 06:54:15.000'),
(412, 196, '38.41.188.181', 'VE', 'Mozilla/5.0 (Linux; Android 13; 220333QL Build/TKQ1.221114.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 07:23:48.000'),
(413, 196, '173.252.95.114', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 07:24:00.000'),
(414, 196, '31.13.103.1', 'DK', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 07:47:43.000'),
(415, 196, '181.41.99.95', 'GY', 'Mozilla/5.0 (Linux; Android 14; Z2466 Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.116 Mobile Safari/537.36[FBAN/EMA;FBLC/es_ES;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-03 07:47:46.000'),
(416, 196, '69.171.249.32', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 08:18:57.000'),
(417, 196, '69.171.249.4', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 08:18:59.000'),
(418, 196, '173.252.83.2', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 08:18:59.000'),
(419, 196, '173.252.87.18', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 08:18:59.000'),
(420, 196, '173.252.107.113', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 08:31:06.000'),
(421, 196, '179.87.220.153', 'BR', 'Mozilla/5.0 (Linux; Android 15; moto g05 Build/VVTA35.51-137; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 08:32:25.000'),
(422, 196, '173.252.79.7', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 08:43:21.000'),
(423, 196, '47.31.111.144', 'IN', 'Mozilla/5.0 (Linux; Android 11; RMX3261 Build/RP1A.201005.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/536.1.0.58.77;IABMV/1;]', '2026-01-03 08:48:53.000'),
(424, 196, '173.252.127.9', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 08:49:04.000'),
(425, 196, '179.0.110.49', 'BR', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-03 08:49:47.000'),
(426, 196, '105.245.40.126', 'ZA', 'Mozilla/5.0 (Linux; Android 13; Hisense U53 Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.193 Mobile Safari/537.36[FBAN/EMA;FBLC/en_US;FBAV/483.0.0.13.108;FBCX/modulariab;]', '2026-01-03 09:17:45.000'),
(427, 196, '105.245.40.126', 'ZA', 'Mozilla/5.0 (Linux; Android 13; Hisense U53 Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.193 Mobile Safari/537.36[FBAN/EMA;FBLC/en_US;FBAV/483.0.0.13.108;FBCX/modulariab;]', '2026-01-03 09:17:51.000'),
(428, 196, '189.92.96.96', 'BR', 'Mozilla/5.0 (Linux; Android 12; SM-A032M Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36[FBAN/EMA;FBLC/pt_BR;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-03 09:33:34.000'),
(429, 228, '69.63.189.20', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 09:34:08.000'),
(430, 228, '69.63.189.3', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 09:34:08.000'),
(431, 228, '69.63.189.44', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 09:34:09.000'),
(432, 228, '69.63.189.44', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 09:34:09.000'),
(433, 228, '173.252.82.9', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 09:34:13.000'),
(434, 228, '173.252.79.116', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 09:34:16.000'),
(435, 196, '69.63.189.6', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 10:35:27.000'),
(436, 196, '173.252.87.12', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 10:45:04.000'),
(437, 196, '200.85.1.196', 'SV', 'Mozilla/5.0 (Linux; Android 11; LM-K510 Build/RKQ1.210420.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 10:49:46.000'),
(438, 196, '31.13.103.6', 'DK', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 10:50:12.000'),
(439, 196, '200.85.1.196', 'SV', 'Mozilla/5.0 (Linux; Android 11; LM-K510 Build/RKQ1.210420.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 10:53:57.000'),
(440, 196, '191.95.164.56', 'CO', 'Mozilla/5.0 (Linux; Android 12; vivo 1938 Build/SP1A.210812.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 11:01:31.000'),
(441, 196, '191.95.164.56', 'CO', 'Mozilla/5.0 (Linux; Android 12; vivo 1938 Build/SP1A.210812.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 11:02:42.000'),
(442, 196, '117.99.228.208', 'IN', 'Mozilla/5.0 (Linux; Android 12; CPH2325 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/142.0.7444.212 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/541.0.0.85.79;IABMV/1;]', '2026-01-03 11:19:57.000'),
(443, 196, '173.252.127.39', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 11:24:40.000'),
(444, 196, '45.172.218.9', 'CO', 'Mozilla/5.0 (Linux; Android 10; M2006C3LG Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.115 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 11:35:54.000'),
(445, 196, '69.171.249.17', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 11:35:54.000'),
(446, 196, '187.184.11.163', 'MX', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-03 12:21:19.000'),
(447, 196, '223.123.118.35', 'PK', 'Mozilla/5.0 (Linux; Android 13; 4G Platinum Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.120 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/489.0.0.66.81;]', '2026-01-03 12:43:48.000'),
(448, 196, '223.123.118.35', 'PK', 'Mozilla/5.0 (Linux; Android 13; 4G Platinum Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.120 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/489.0.0.66.81;]', '2026-01-03 12:45:12.000'),
(449, 196, '123.16.187.159', 'VN', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23C55 Safari/604.1 [FBAN/FBIOS;FBAV/543.0.0.47.72;FBBV/845843444;FBDV/iPhone14,2;FBMD/iPhone;FBSN/iOS;FBSV/26.2;FBSS/3;FBID/phone;FBLC/en_GB;FBOP/5;FBRV/854230558;IABMV/1]', '2026-01-03 12:52:04.000'),
(450, 236, '195.216.243.153', 'RU', 'Mozilla/5.0 (Windows; U; Windows NT 5.1; ru; rv:1.9.1.5) Gecko/20091102 Firefox/3.5.5 GTB6', '2026-01-03 13:05:59.000'),
(451, 196, '5.155.143.115', 'SY', 'Mozilla/5.0 (Linux; Android 11; SM-A037F Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/140.0.7339.208 Mobile Safari/537.36[FBAN/EMA;FBLC/ar_AR;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-03 13:25:06.000'),
(452, 196, '5.155.72.165', 'SY', 'Mozilla/5.0 (Linux; Android 11; SM-A037F Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/140.0.7339.208 Mobile Safari/537.36[FBAN/EMA;FBLC/ar_AR;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-03 13:31:31.000'),
(453, 196, '5.155.72.165', 'SY', 'Mozilla/5.0 (Linux; Android 11; SM-A037F Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/140.0.7339.208 Mobile Safari/537.36[FBAN/EMA;FBLC/ar_AR;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-03 13:31:50.000'),
(454, 239, '195.216.243.153', 'RU', 'Mozilla/5.0 (Windows; U; Windows NT 5.1; ru; rv:1.9.1.5) Gecko/20091102 Firefox/3.5.5 GTB6', '2026-01-03 13:47:00.000'),
(455, 239, '173.252.107.3', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 13:48:42.000'),
(456, 239, '173.252.107.7', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 13:48:49.000'),
(457, 239, '173.252.107.5', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 13:48:52.000'),
(458, 239, '173.252.107.114', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 13:49:05.000'),
(459, 239, '69.63.189.12', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 13:49:18.000'),
(460, 239, '31.13.115.3', 'SE', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 13:49:18.000'),
(461, 239, '31.13.115.114', 'SE', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', '2026-01-03 13:49:22.000'),
(462, 239, '173.252.95.6', 'US', 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:58.0) Gecko/20100101 Firefox/59.0', '2026-01-03 13:49:23.000'),
(463, 239, '173.252.82.18', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 13:50:01.000'),
(464, 239, '66.220.149.61', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 13:50:02.000'),
(465, 239, '69.171.230.8', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 13:50:10.000'),
(466, 239, '173.252.70.6', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 13:50:15.000'),
(467, 196, '69.171.231.23', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 13:52:39.000'),
(468, 239, '173.252.82.20', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 13:54:27.000'),
(469, 239, '66.220.149.1', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 13:54:28.000'),
(470, 239, '173.252.83.115', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 13:54:29.000'),
(471, 196, '154.72.162.55', 'CM', 'Mozilla/5.0 (Linux; Android 11; M2003J15SC Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36[FBAN/EMA;FBLC/fr_FR;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-03 13:59:26.000'),
(472, 239, '69.171.234.14', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:03:38.000'),
(473, 239, '69.171.234.34', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:03:43.000'),
(474, 239, '69.171.234.25', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:04:01.000'),
(475, 239, '173.252.79.18', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:04:02.000'),
(476, 239, '69.171.231.18', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:04:03.000'),
(477, 239, '31.13.103.6', 'DK', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:04:03.000'),
(478, 239, '69.171.231.10', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:04:04.000'),
(479, 239, '31.13.127.115', 'IE', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:04:05.000'),
(480, 239, '173.252.95.26', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:04:06.000'),
(481, 239, '173.252.107.18', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:04:06.000'),
(482, 239, '173.252.87.5', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:04:24.000'),
(483, 239, '82.78.49.205', 'RO', 'Mozilla/5.0 (Linux; Android 15; motorola edge 50 neo Build/V2UI35.43-12-4; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36[FBAN/EMA;FBLC/ro_RO;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-03 14:05:13.000'),
(484, 239, '173.252.127.11', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:06:47.000'),
(485, 239, '31.13.115.114', 'SE', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:06:47.000'),
(486, 239, '69.171.249.116', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:06:47.000'),
(487, 239, '69.63.184.8', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:06:49.000'),
(488, 239, '69.63.184.12', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:06:51.000'),
(489, 239, '37.63.29.83', 'BG', 'Mozilla/5.0 (Linux; Android 15; 24040RN64Y Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.146 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/542.0.0.46.151;IABMV/1;]', '2026-01-03 14:07:27.000'),
(490, 239, '69.63.189.8', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:08:16.000'),
(491, 239, '173.252.83.113', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:08:20.000'),
(492, 239, '173.252.127.26', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:08:46.000'),
(493, 239, '173.252.95.2', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:09:24.000'),
(494, 239, '173.252.127.59', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:09:40.000'),
(495, 239, '31.13.103.115', 'DK', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:09:40.000'),
(496, 239, '150.107.232.223', 'IN', 'Mozilla/5.0 (Linux; Android 14; SM-E236B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 14:09:42.000'),
(497, 239, '31.13.115.8', 'SE', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:09:43.000'),
(498, 239, '31.13.115.8', 'SE', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:09:45.000'),
(499, 239, '173.252.87.10', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:14:30.000'),
(500, 239, '181.236.65.19', 'CO', 'Mozilla/5.0 (Linux; Android 15; 24094RAD4G Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 14:14:55.000'),
(501, 239, '51.195.235.194', 'GB', 'Mozilla/5.0 (Linux; Android 11; V2043_21 Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/542.0.0.46.151;IABMV/1;]', '2026-01-03 14:15:19.000'),
(502, 239, '69.171.234.59', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:15:32.000'),
(503, 239, '31.13.103.6', 'DK', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:19:34.000'),
(504, 239, '173.252.107.5', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:19:34.000'),
(505, 239, '170.78.208.24', 'MX', 'Mozilla/5.0 (Linux; Android 15; 2312CRNCCL Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36[FBAN/EMA;FBLC/es_LA;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-03 14:19:57.000'),
(506, 239, '69.171.234.43', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:22:53.000'),
(507, 239, '31.13.115.114', 'SE', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:24:37.000'),
(508, 239, '187.211.108.83', 'MX', 'Mozilla/5.0 (Linux; Android 11; ZTE Blade L9 Build/RP1A.201005.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.116 Mobile Safari/537.36[FBAN/EMA;FBLC/en_US;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-03 14:24:50.000'),
(509, 196, '69.171.249.117', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:24:53.000'),
(510, 239, '187.211.108.83', 'MX', 'Mozilla/5.0 (Linux; Android 11; ZTE Blade L9 Build/RP1A.201005.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.116 Mobile Safari/537.36[FBAN/EMA;FBLC/en_US;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-03 14:26:35.000'),
(511, 239, '69.171.230.5', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:29:03.000'),
(512, 239, '69.171.249.1', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:29:44.000'),
(513, 239, '187.211.108.83', 'MX', 'Mozilla/5.0 (Linux; Android 11; ZTE Blade L9 Build/RP1A.201005.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.116 Mobile Safari/537.36[FBAN/EMA;FBLC/en_US;FBAV/492.0.0.6.105;FBCX/modulariab;]', '2026-01-03 14:31:59.000'),
(514, 196, '31.13.127.36', 'IE', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:35:11.000'),
(515, 196, '200.68.156.214', 'MX', 'Mozilla/5.0 (Linux; Android 15; moto g05 Build/VVTA35.51-137; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/542.0.0.46.151;IABMV/1;]', '2026-01-03 14:40:05.000'),
(516, 196, '69.63.184.113', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:47:05.000'),
(517, 239, '90.120.25.34', 'FR', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23C55 [FBAN/FBIOS;FBAV/542.0.0.37.140;FBBV/840410395;FBDV/iPhone12,1;FBMD/iPhone;FBSN/iOS;FBSV/26.2;FBSS/2;FBID/phone;FBLC/fr_FR;FBOP/5;FBRV/846141037;IABMV/1]', '2026-01-03 14:47:08.000'),
(518, 239, '66.220.149.17', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:47:37.000'),
(519, 239, '66.220.149.30', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 14:47:37.000'),
(520, 239, '39.48.115.47', 'PK', 'Mozilla/5.0 (Linux; Android 12; NEW 15 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 14:47:43.000'),
(521, 239, '69.63.189.3', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 15:05:34.000'),
(522, 196, '129.45.37.253', 'DZ', 'Mozilla/5.0 (Linux; Android 10; M2006C3LI Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36[FBAN/EMA;FBLC/fr_FR;FBAV/491.0.0.7.112;FBCX/modulariab;]', '2026-01-03 15:08:12.000'),
(523, 239, '154.223.132.92', 'US', 'Mozilla/5.0 (Linux; Android 13; RMX3195 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 15:13:13.000'),
(524, 239, '188.236.178.185', 'KW', 'Mozilla/5.0 (Linux; Android 12; SM-N975F Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 15:19:47.000'),
(525, 239, '188.236.178.185', 'KW', 'Mozilla/5.0 (Linux; Android 12; SM-N975F Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;] FBNV/500', '2026-01-03 15:19:49.000'),
(526, 239, '188.236.178.185', 'KW', 'Mozilla/5.0 (Linux; Android 12; SM-N975F Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 15:20:49.000'),
(527, 239, '168.181.15.123', 'BR', 'Mozilla/5.0 (Linux; Android 12; TECNO BF7 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.143 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;] FBNV/500', '2026-01-03 15:22:34.000'),
(528, 239, '69.63.184.112', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 15:29:08.000'),
(529, 239, '51.39.229.61', 'SA', 'Mozilla/5.0 (Linux; Android 12; Redmi K20 Pro Build/HUAWEIJLN-LX1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/114.0.5735.196 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/443.0.0.23.229;]', '2026-01-03 15:35:19.000'),
(530, 196, '41.123.14.3', 'ZA', 'Mozilla/5.0 (Linux; Android 12; GFY-LX1 Build/HUAWEIGFY-LX1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/114.0.5735.196 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/520.0.0.44.99;]', '2026-01-03 15:52:50.000'),
(531, 239, '152.206.121.91', 'CU', 'Mozilla/5.0 (Linux; Android 10; M2006C3MNG Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/133.0.6943.117 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/502.0.0.66.79;]', '2026-01-03 16:01:32.000'),
(532, 239, '173.252.95.48', 'US', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', '2026-01-03 16:05:36.000'),
(533, 196, '102.91.78.231', 'NG', 'Mozilla/5.0 (Linux; Android 12; TECNO LG6n Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.34 Mobile Safari/537.36[FBAN/EMA;FBLC/en_US;FBAV/487.0.0.11.107;FBCX/modulariab;]', '2026-01-03 16:05:55.000'),
(534, 239, '178.221.10.205', 'RS', 'Mozilla/5.0 (Linux; Android 14; SM-A137F Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.116 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/543.0.0.55.73;IABMV/1;]', '2026-01-03 16:07:28.000');

-- --------------------------------------------------------

--
-- Struktur dari tabel `conversions`
--

CREATE TABLE `conversions` (
  `id` int NOT NULL,
  `click_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `sub_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Unknown',
  `network` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'IMONETIZEIT',
  `country` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'US',
  `country_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'United States',
  `traffic_type` enum('WAP','WEB','APP','BOT') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'WAP',
  `earning` decimal(10,4) DEFAULT '0.0000',
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `domain`
--

CREATE TABLE `domain` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subdomain` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `ssl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `addedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `domain`
--

INSERT INTO `domain` (`id`, `name`, `subdomain`, `status`, `ssl`, `addedAt`) VALUES
(5, 'ccpxengine.shop', NULL, 'Active', 'Active', '2026-01-02 03:40:48.000'),
(7, 'massage-me.my.id', NULL, 'Active', 'Active', '2026-01-02 05:58:49.000'),
(8, 'massage-mex.my.id', NULL, 'Active', 'Active', '2026-01-02 20:15:57.000');

-- --------------------------------------------------------

--
-- Struktur dari tabel `link`
--

CREATE TABLE `link` (
  `id` int NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetUrl` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `domain` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trackerId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `network` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ogImage` text COLLATE utf8mb4_unicode_ci,
  `ogTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ogDescription` text COLLATE utf8mb4_unicode_ci,
  `clickCount` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `useLandingPage` tinyint(1) NOT NULL DEFAULT '0',
  `leadCount` int DEFAULT '0',
  `totalPayout` decimal(10,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `link`
--

INSERT INTO `link` (`id`, `slug`, `targetUrl`, `domain`, `trackerId`, `network`, `ogImage`, `ogTitle`, `ogDescription`, `clickCount`, `createdAt`, `useLandingPage`, `leadCount`, `totalPayout`) VALUES
(189, 'FmGqwDjtdmxP6oORgjNSTwgqJw3l7aXM', 'https://dchggad.aiflirtclick.com/s/677e17d214579?sub1=1&track=11&subsource=&ext_click_id=one', 'massage-mex.my.id', '28', 'Trafee', NULL, NULL, NULL, 0, '2026-01-02 21:10:12.000', 0, 0, 0.00),
(190, 'hsPCtf6tqeAkvkSxfGTRhgaJNlFHTzpM', 'https://dchggad.aiflirtclick.com/s/677e17d214579?sub1=1&track=11&subsource=&ext_click_id=one', 'massage-mex.my.id', '28', 'Trafee', NULL, NULL, NULL, 0, '2026-01-02 21:10:32.000', 0, 0, 0.00),
(191, 'fMslXT7vJnwBtI7FQNS80Wd3S95kDqjo', 'https://dchggad.aiflirtclick.com/s/677e17d214579?sub1=1&track=11&subsource=&ext_click_id=one', 'massage-mex.my.id', '28', 'Trafee', NULL, NULL, NULL, 0, '2026-01-02 21:10:33.000', 0, 0, 0.00),
(192, 'nLBVYA6IrPwGgJcKmvc0Bb9ji19j7O18', 'https://dchggad.aiflirtclick.com/s/677e17d214579?sub1=1&track=11&subsource=&ext_click_id=one', 'massage-mex.my.id', '28', 'Trafee', NULL, NULL, NULL, 0, '2026-01-02 21:10:35.000', 0, 0, 0.00),
(193, '7iljOsWNQTbZ5Cj9YmRcdCYmSn5UVu12', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=honda', 'massage-mex.my.id', '28', 'Trafee', NULL, NULL, NULL, 0, '2026-01-02 21:41:52.000', 0, 0, 0.00),
(194, 'on6IZijX1Bl6YrMjgHQNDAcll6eshysg', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=honda', 'massage-mex.my.id', '28', 'Trafee', NULL, NULL, NULL, 0, '2026-01-02 21:42:03.000', 1, 0, 0.00),
(195, 'gKO0g6Rv2JMjnkRsVfWCk6kv84qH9YUB', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=honda', 'massage-mex.my.id', '28', 'Trafee', NULL, NULL, NULL, 0, '2026-01-02 21:56:45.000', 0, 0, 0.00),
(196, 'fThZdM05iNZQQow7i1kaOt2Sz2FzOSs4', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=SHERLY', 'ccpxengine.shop', '29', 'Trafee', NULL, NULL, NULL, 187, '2026-01-02 22:01:22.000', 0, 0, 0.00),
(197, 'EgNuQtb1x9OQXebJdLC0kdeSfrnTRvlc', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=honda', 'massage-mex.my.id', '28', 'Trafee', NULL, NULL, NULL, 0, '2026-01-02 22:50:06.000', 0, 0, 0.00),
(198, 'NgmsrppHqygGxrLW69ZL2QeZlTswtR4I', 'https://cyapbre.more-datinghub.com/wzvrd4r/?u=xx&o=xx&t=SHERLY&cid={click_id}', 'massage-me.my.id', '29', 'Lospollos', NULL, NULL, NULL, 0, '2026-01-02 23:05:49.000', 0, 0, 0.00),
(199, 'p6WvXhTRfjaHnA6dRfBbkE8705mKlxXA', 'https://cyapbre.more-datinghub.com/wzvrd4r/?u=xx&o=xx&t=SHERLY&cid={click_id}', 'massage-me.my.id', '29', 'Lospollos', NULL, NULL, NULL, 0, '2026-01-02 23:06:45.000', 0, 0, 0.00),
(200, 'wUnryHC6wTTKxNBHWre0snGUho3W8eZ4', 'https://cyapbre.more-datinghub.com/wzvrd4r/?u=xx&o=xx&t=SHERLY&cid={click_id}', 'ccpxengine.shop', '29', 'Lospollos', NULL, NULL, NULL, 0, '2026-01-02 23:06:48.000', 0, 0, 0.00),
(201, 'uolrFGdoRc87cxWxMTGddTs41U99ZGPo', 'https://cyapbre.more-datinghub.com/wzvrd4r/?u=xx&o=xx&t=SHERLY&cid={click_id}', 'massage-mex.my.id', '29', 'Lospollos', NULL, NULL, NULL, 0, '2026-01-02 23:06:49.000', 0, 0, 0.00),
(202, 'NEHMHmEisJn3D3q7jXXbPz1UDeKIb44x', 'https://cyapbre.more-datinghub.com/wzvrd4r/?u=xx&o=xx&t=SHERLY&cid={click_id}', 'ccpxengine.shop', '29', 'Lospollos', NULL, NULL, NULL, 0, '2026-01-02 23:06:50.000', 0, 0, 0.00),
(203, 'jh1s5JTXRBERzUWe72uU9jdPOAg33I5h', 'https://cyapbre.more-datinghub.com/wzvrd4r/?u=xx&o=xx&t=SHERLY&cid={click_id}', 'massage-me.my.id', '29', 'Lospollos', NULL, NULL, NULL, 0, '2026-01-02 23:06:51.000', 0, 0, 0.00),
(204, 'GQ2yxo79SOUEAS2c5VGDruBcVJg5mS7a', 'https://cyapbre.more-datinghub.com/wzvrd4r/?u=xx&o=xx&t=SHERLY&cid={click_id}', 'massage-me.my.id', '29', 'Lospollos', NULL, NULL, NULL, 24, '2026-01-02 23:06:52.000', 0, 0, 0.00),
(205, 'WITP6nyVFeS3ssfYqVQlNt3mX8nOfeDO', 'https://cyapbre.more-datinghub.com/wzvrd4r/?u=xx&o=xx&t=honda&cid={click_id}', 'massage-mex.my.id', '28', 'Lospollos', NULL, NULL, NULL, 0, '2026-01-02 23:07:08.000', 0, 0, 0.00),
(206, 'eoEGq0HlkCcuXKeKpAia1w2RV7QZMifU', 'https://cyapbre.more-datinghub.com/wzvrd4r/?u=xx&o=xx&t=honda&cid={click_id}', 'massage-mex.my.id', '28', 'Lospollos', NULL, NULL, NULL, 127, '2026-01-02 23:07:37.000', 0, 0, 0.00),
(207, 'qSzqtI1KkvWw6mtRA8rChfOlInuWw7p4', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=honda', 'massage-mex.my.id', '28', 'Trafee', NULL, NULL, NULL, 2, '2026-01-02 23:26:13.000', 1, 0, 0.00),
(208, 'vixkSr7IYq7IIVdhsfKVcxybGe2HeFzi', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=honda', 'massage-mex.my.id', '28', 'Trafee', NULL, NULL, NULL, 0, '2026-01-02 23:26:47.000', 1, 0, 0.00),
(209, 'SuIdPr54It8xlzhPPNe9QAi4JohgMT7Z', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=Hartoyo99', 'ccpxengine.shop', '30', 'Trafee', NULL, NULL, NULL, 0, '2026-01-02 23:33:37.000', 0, 0, 0.00),
(210, 'svn4vSyRChkRSdlBwQ4hzoPXhqDymzO6', 'https://cyapbre.more-datinghub.com/wzvrd4r?s1=honda&cid={click_id}', 'massage-me.my.id', '28', 'Lospollos', NULL, NULL, NULL, 3, '2026-01-02 23:33:58.000', 0, 1, 2.40),
(211, '8MgXy4TipA7IrV1Tz0NIgq1qF3wqrKkM', 'https://cyapbre.more-datinghub.com/wzvrd4r/?u=xx&o=xx&t=SHERLY&cid={click_id}', 'massage-mex.my.id', '29', 'Lospollos', NULL, NULL, NULL, 5, '2026-01-02 23:34:39.000', 0, 0, 0.00),
(212, 'kZqZvsKyPPKCncWXA6pmB9QWvs82jg8X', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=Hartoyo99', 'massage-mex.my.id', '30', 'Trafee', NULL, NULL, NULL, 2, '2026-01-02 23:35:00.000', 0, 0, 0.00),
(213, 'fjpYQfhCMAccbKzH3pox4RJmMEbA7pH6', 'https://cyapbre.more-datinghub.com/wzvrd4r?s1=honda&cid={click_id}', 'massage-me.my.id', '28', 'Lospollos', NULL, NULL, NULL, 0, '2026-01-02 23:36:44.000', 0, 0, 0.00),
(214, '8U3gbcv6kb85TrOEkdjfJfp9icfBoyhW', 'https://cyapbre.more-datinghub.com/wzvrd4r?s1=honda&cid={click_id}', 'massage-me.my.id', '28', 'Lospollos', NULL, NULL, NULL, 0, '2026-01-02 23:36:45.000', 0, 0, 0.00),
(215, '5xvSUMfgHAvJaK3o8wQD4QJTS6nMURDs', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=SHERLY', 'massage-me.my.id', '29', 'Trafee', NULL, NULL, NULL, 1, '2026-01-03 00:26:00.000', 0, 0, 0.00),
(216, 'jFUIINiIJ0yxcUsHclLzKVb3CCuwpVQ8', 'https://cyapbre.more-datinghub.com/wzvrd4r?s1=SHERLY&cid={click_id}', 'massage-me.my.id', '29', 'Lospollos', NULL, NULL, NULL, 4, '2026-01-03 00:37:20.000', 0, 1, 2.40),
(217, '1XDoOo8uxP68GbjkhbPKu2Sl3u0KbpE3', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=TES', 'ccpxengine.shop', '31', 'Trafee', NULL, NULL, NULL, 1, '2026-01-03 00:51:58.000', 0, 0, 0.00),
(218, 'YDGSWrXAAec2gKE8bChRKM9QIl9MelLO', 'https://cyapbre.more-datinghub.com/wzvrd4r?s1=honda&cid={click_id}', 'massage-mex.my.id', '28', 'Lospollos', NULL, NULL, NULL, 0, '2026-01-03 01:04:46.000', 0, 0, 0.00),
(219, 'EXNAwptU90Ucv50FngX9ZytFW10t3xrm', 'https://cyapbre.more-datinghub.com/wzvrd4r?s1=honda&cid={click_id}', 'massage-me.my.id', '28', 'Lospollos', NULL, NULL, NULL, 0, '2026-01-03 01:05:04.000', 0, 0, 0.00),
(220, 'WwjOdGFx0DCI1OygqxFopFx4O79xbU9h', 'https://cyapbre.more-datinghub.com/wzvrd4r?s1=SHERLY&cid={click_id}', 'massage-mex.my.id', '29', 'Lospollos', NULL, NULL, NULL, 0, '2026-01-03 01:07:36.000', 0, 0, 0.00),
(221, 'pkrMqwwIXp0wNrOmhK9DWTCQZW6eROCB', 'https://cyapbre.more-datinghub.com/wzvrd4r?s1=SHERLY&cid={click_id}', 'ccpxengine.shop', '29', 'Lospollos', NULL, NULL, NULL, 0, '2026-01-03 01:12:27.000', 0, 0, 0.00),
(222, '1SNHI3Pb8s5AC0Kho31k108HU8etLgUT', 'https://cyapbre.more-datinghub.com/wzvrd4r?s1=SHERLY&cid={click_id}', 'ccpxengine.shop', '29', 'Lospollos', NULL, NULL, NULL, 0, '2026-01-03 01:25:17.000', 0, 0, 0.00),
(223, 'bqx75DjOThQFpsflkLAtf4DVUzAmeZZX', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=SHERLY', 'massage-me.my.id', '29', 'Trafee', NULL, NULL, NULL, 0, '2026-01-03 02:18:32.000', 0, 0, 0.00),
(224, 'lY1Ptq8VRVxZI50VctvAHl6aOiQHV2aB', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=SHERLY', 'massage-me.my.id', '29', 'Trafee', NULL, NULL, NULL, 0, '2026-01-03 05:34:08.000', 0, 0, 0.00),
(225, 'pWBXN2VKcdJd5GXk5KAVAcqt3Z8VMKyn', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=SHERLY', 'massage-me.my.id', '29', 'Trafee', NULL, NULL, NULL, 0, '2026-01-03 05:34:11.000', 0, 0, 0.00),
(226, 'jtxZnchhczURC9o8dUVGsARnroi7MUO6', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=SHERLY', 'massage-me.my.id', '29', 'Trafee', NULL, NULL, NULL, 0, '2026-01-03 05:34:39.000', 0, 0, 0.00),
(227, 'rX3COkH5mzLL8tnF5ZOWruaZLjqn6van', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=SHERLY', 'massage-me.my.id', '29', 'Trafee', NULL, NULL, NULL, 0, '2026-01-03 05:36:23.000', 0, 0, 0.00),
(228, '38brAz5qI5hMy3MOUeAwV5bpGdlgxHiN', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=SHERLY', 'massage-me.my.id', '29', 'Trafee', NULL, NULL, NULL, 21, '2026-01-03 05:36:25.000', 0, 0, 0.00),
(229, 'LziL2DgEZhNCk3iwqwfMs4KcxGV0G0wT', 'https://cyapbre.more-datinghub.com/wzvrd4r?s1=SHERLY&cid={click_id}', 'massage-mex.my.id', '29', 'Lospollos', NULL, NULL, NULL, 0, '2026-01-03 09:07:55.000', 0, 0, 0.00),
(230, 'zcQ06YZNqv9wfThDG0kL19yg9mbcNpEW', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=Hartoyo99', 'massage-mex.my.id', '30', 'Trafee', NULL, NULL, NULL, 0, '2026-01-03 10:21:46.000', 0, 0, 0.00),
(231, 'z9rdLTVZ5qAITwJUBmWP9ijTAHJoEMO3', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=Hartoyo99', 'massage-mex.my.id', '30', 'Trafee', NULL, NULL, NULL, 0, '2026-01-03 10:21:57.000', 0, 0, 0.00),
(232, '6b0yPJqHa1ZEsHWS0abhujvniqoCgBnN', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=Hartoyo99', 'massage-mex.my.id', '30', 'Trafee', NULL, NULL, NULL, 0, '2026-01-03 10:21:58.000', 0, 0, 0.00),
(233, 'BYF15s5FWQtK16qAn4rLL4wcBUdz5O1A', 'https://cyapbre.more-datinghub.com/wzvrd4r?s1=Hartoyo99&cid={click_id}', 'massage-mex.my.id', '30', 'Lospollos', NULL, NULL, NULL, 0, '2026-01-03 10:22:06.000', 0, 0, 0.00),
(234, 'e49CX6wF8IS2Ay3iSNxCCjOUF79p6n7O', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=Hartoyo99', 'massage-mex.my.id', '30', 'Trafee', NULL, NULL, NULL, 0, '2026-01-03 10:22:16.000', 0, 0, 0.00),
(235, '6jaBW26ufH2IftYHi8PgEpZSDNEM4Mvq', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=Hartoyo99', 'ccpxengine.shop', '30', 'Trafee', NULL, NULL, NULL, 0, '2026-01-03 13:04:44.000', 0, 0, 0.00),
(236, '6aaxX6DYBtvkb0GTKEOFKVZZ4nZMzl5w', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=Hartoyo99', 'massage-mex.my.id', '30', 'Trafee', NULL, NULL, NULL, 1, '2026-01-03 13:05:44.000', 0, 0, 0.00),
(237, '6Gla9cd9XdUg7hIXPjZxkanyIIJSM7i1', 'https://cyapbre.more-datinghub.com/wzvrd4r?s1=Hartoyo99&cid={click_id}', 'massage-me.my.id', '30', 'Lospollos', NULL, NULL, NULL, 0, '2026-01-03 13:17:42.000', 0, 0, 0.00),
(238, 'yekqLQAtf9mVm5bpCsKuLM4WK0Pn38Jk', 'https://cyapbre.more-datinghub.com/wzvrd4r?s1=Hartoyo99&cid={click_id}', 'massage-me.my.id', '30', 'Lospollos', NULL, NULL, NULL, 0, '2026-01-03 13:18:11.000', 0, 0, 0.00),
(239, 'unbI7z5Ujb16FAybCcwPJNIEm6Tugn1w', 'https://dchggad.aiflirtclick.com/s/677e17d214579?c?track={click_id}&subsource=Hartoyo99', 'massage-me.my.id', '30', 'Trafee', NULL, NULL, NULL, 72, '2026-01-03 13:46:47.000', 0, 0, 0.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `tracker`
--

CREATE TABLE `tracker` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `team` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `targetUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `domainId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `tracker`
--

INSERT INTO `tracker` (`id`, `name`, `slug`, `team`, `password`, `targetUrl`, `domainId`, `createdAt`) VALUES
(28, 'honda', 'honda', 'ADMIN', 'NEWYEAR26', '', NULL, '2026-01-02 21:07:52.000'),
(29, 'SHERLY', 'SHERLY', 'ADMIN', 'Dadang87', '', NULL, '2026-01-02 21:17:00.000'),
(30, 'Hartoyo99', 'Hartoyo99', 'ADMIN', 'Fredy123', '', NULL, '2026-01-02 22:21:09.000'),
(31, 'TES', 'TES', 'ADMIN', '1234', '', NULL, '2026-01-03 00:51:46.000'),
(33, 'TENOR', 'TENOR', 'ADMIN', 'tenor123', '', NULL, '2026-01-03 15:37:59.000');

-- --------------------------------------------------------

--
-- Struktur dari tabel `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('9247acb9-e006-470b-b9d7-b624e9ff72c8', 'ea1f457cf75e4dea943562fe5dc735593953a699d614037106bd6337d17e83ce', '2025-12-25 12:14:08.541', '20251225121408_init_admin', NULL, NULL, '2025-12-25 12:14:08.170', 1),
('c4d4b703-b761-4d3d-86b7-a721440857e6', '58edec8e9049e118f484ca02c12913e68d3adb7707243e7623bedc08d12c52ea', '2025-12-25 12:14:07.489', '20251221224821_init', NULL, NULL, '2025-12-25 12:14:07.314', 1),
('e6925476-e994-4994-91ca-2844af6e9339', 'c9c5ab8d82fd39dad3634fb1c74325e6caeab17ca3a993aef63cb6ae69cb7fb0', '2025-12-25 12:14:07.508', '20251222000935_add_campaign_model', NULL, NULL, '2025-12-25 12:14:07.491', 1);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Admin_username_key` (`username`);

--
-- Indeks untuk tabel `campaign`
--
ALTER TABLE `campaign`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `click`
--
ALTER TABLE `click`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Click_linkId_idx` (`linkId`),
  ADD KEY `Click_createdAt_idx` (`createdAt`);

--
-- Indeks untuk tabel `domain`
--
ALTER TABLE `domain`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `link`
--
ALTER TABLE `link`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Link_slug_key` (`slug`);

--
-- Indeks untuk tabel `tracker`
--
ALTER TABLE `tracker`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Tracker_slug_key` (`slug`),
  ADD KEY `Tracker_domainId_fkey` (`domainId`);

--
-- Indeks untuk tabel `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `campaign`
--
ALTER TABLE `campaign`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT untuk tabel `click`
--
ALTER TABLE `click`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=535;

--
-- AUTO_INCREMENT untuk tabel `domain`
--
ALTER TABLE `domain`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `link`
--
ALTER TABLE `link`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=240;

--
-- AUTO_INCREMENT untuk tabel `tracker`
--
ALTER TABLE `tracker`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `click`
--
ALTER TABLE `click`
  ADD CONSTRAINT `Click_linkId_fkey` FOREIGN KEY (`linkId`) REFERENCES `link` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `tracker`
--
ALTER TABLE `tracker`
  ADD CONSTRAINT `Tracker_domainId_fkey` FOREIGN KEY (`domainId`) REFERENCES `domain` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
