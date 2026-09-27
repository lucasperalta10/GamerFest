-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: gamerfest
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `event_date` datetime NOT NULL,
  `type` enum('showcase','conferencia','premiacion','lanzamiento','otro') NOT NULL DEFAULT 'otro',
  `location_link` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Xbox Developer_Direct 2026','Vistazo en profundidad a varios títulos previstos para Xbox y PC con entrevistas y secuencias de juego extendidas.','2026-01-22 21:00:00','showcase','https://www.youtube.com/@xbox','/images/events/xboxdeveloperdirect.jpeg','2026-06-10 16:42:21','2026-06-10 16:44:22'),(2,'State of Play Junio  2026','Presentación de novedades y actualizaciones sobre próximos juegos que llegarán a PlayStation 5 y PS VR2.','2026-06-02 10:00:00','showcase','https://www.youtube.com/@playstation','https://i.ytimg.com/vi_webp/cvh0xXmu0bs/maxresdefault.webp','2026-06-10 16:42:21','2026-09-05 16:22:48'),(5,'Summer Game Fest 2026','La gran celebración anual de la industria de los videojuegos con novedades, primicias y avances exclusivos organizada por Geoff Keighley.','2026-06-05 03:00:00','showcase','https://www.youtube.com/@TheGameAwards','/images/events/summergamefest.webp','2026-06-10 16:42:21','2026-06-10 16:47:33'),(6,'Xbox Games Showcase 2026','Presentación de los próximos juegos de Xbox Game Studios y sus socios internacionales.','2026-06-07 20:00:00','showcase','https://www.twitch.tv/xbox','/images/events/xboxgamesshowcase.webp','2026-06-10 16:42:21','2026-06-10 16:46:09'),(8,'Nintendo Direct Junio 2026','Direct enfocado en los juegos que llegarán en la segunda mitad de 2026.','2026-06-09 17:00:00','showcase','https://www.youtube.com/user/nintendo','/images/events/nintendodirect.webp','2026-06-10 16:42:21','2026-06-10 16:46:00'),(9,'Gamescom Opening Night Live 2026','La gran inauguración en directo de Gamescom 2026 en Colonia, Alemania.','2026-08-25 18:00:00','showcase','https://www.gamescom.global','https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop','2026-06-10 16:42:21','2026-06-10 16:42:21'),(11,'The Game Awards 2026','La ceremonia de premiación de videojuegos más importante del año, celebrando la excelencia e introduciendo primicias exclusivas.','2026-12-10 19:30:00','premiacion','https://thegameawards.com','https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?q=80&w=600&auto=format&fit=crop','2026-06-10 16:42:21','2026-06-10 16:42:21'),(12,'The Triple-i Initiative 2026','Showcase digital dedicado íntegramente a juegos independientes de alto presupuesto y producción.','2026-04-17 20:00:00','showcase','','','2026-09-05 16:18:37','2026-09-05 16:18:37'),(13,'BlizzCon 2026','Novedades de franquicias Blizzard (Diablo, Warcraft, Overwatch) y anuncios de contenido futuro.','2026-09-12 16:00:00','conferencia','','','2026-09-05 16:20:10','2026-09-05 16:20:10'),(14,'Tokyo Game Show 2026','Fuerte presencia de estudios asiáticos e internacionales (Capcom, Xbox Broadcast, Bandai Namco, Konami, Square Enix).','2026-09-17 19:00:00','showcase','','','2026-09-05 16:20:59','2026-09-05 16:20:59'),(15,'State of Play Septiembre 2026','','2026-09-03 22:30:00','showcase','https://www.youtube.com/@playstation','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3AFGMmcF0Szv0wYfsAvoTNE3fPvJrAjyKUeRZrb5RDDeyYWLDLXQHN3Eo&s=10','2026-09-05 16:22:37','2026-09-07 22:56:06');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_platforms`
--

DROP TABLE IF EXISTS `game_platforms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_platforms` (
  `game_id` int(11) NOT NULL,
  `platform_id` int(11) NOT NULL,
  PRIMARY KEY (`game_id`,`platform_id`),
  KEY `platform_id` (`platform_id`),
  CONSTRAINT `game_platforms_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `game_platforms_ibfk_2` FOREIGN KEY (`platform_id`) REFERENCES `platforms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_platforms`
--

LOCK TABLES `game_platforms` WRITE;
/*!40000 ALTER TABLE `game_platforms` DISABLE KEYS */;
INSERT INTO `game_platforms` VALUES (1,7),(3,1),(3,2),(3,3),(3,4),(4,1),(4,2),(4,3),(4,5),(4,7),(6,1),(6,2),(6,3),(6,7),(7,1),(7,2),(7,3),(8,1),(8,2),(8,3),(9,2),(10,1),(10,3),(11,1),(11,2),(11,3),(11,4),(11,5),(11,6),(11,7),(12,1),(12,2),(12,3),(14,1),(14,2),(14,3),(15,1),(15,2),(15,3),(15,6),(16,7),(17,2),(17,3),(19,1),(19,2),(19,3),(20,1),(20,2),(20,3),(21,1),(21,2),(21,3),(21,7),(22,2),(23,7),(25,1),(25,2),(26,1),(26,2),(26,3),(27,1),(27,3),(28,1),(28,2),(28,3),(28,4),(29,1),(29,2),(30,1),(30,2),(30,3),(31,1),(31,2),(31,3),(32,1),(32,2),(32,3),(33,1),(33,2),(33,3),(33,7),(34,1),(35,2),(35,3),(35,7),(36,1),(36,2),(36,3),(36,4),(37,1),(38,1),(38,2),(38,3),(39,7),(40,7),(41,1),(41,2),(41,3),(41,7),(42,4),(42,7),(43,7),(44,7),(45,7),(46,7),(47,7);
/*!40000 ALTER TABLE `game_platforms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,'Animal Crossing: New Horizons – Switch 2 Edition','Una versión mejorada del aclamado simulador de vida de Nintendo, optimizada para la nueva generación con mejores gráficos y nuevas opciones de personalización.','2026-01-15','/images/games/animalcrossing.jpg','2026-06-10 16:42:21','2026-06-10 16:42:21'),(3,'Dragon Quest VII Reimagined','Un remake completo de la séptima entrega de la legendaria saga Dragon Quest con gráficos modernos y mejoras de calidad de vida.','2026-02-05','https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/store/software/switch/70010000070157/78759e8c3ad458d67d31fae6519a364ef6eb6eda9d9dcebb19b72e7aa48290e0','2026-06-10 16:42:21','2026-09-05 16:01:14'),(4,'Yakuza Kiwami 3 & Dark Ties','La esperada reedición de la tercera entrega de la saga Yakuza en el motor Dragon Engine, junto con contenido de historia inédito.','2026-02-12','https://sm.ign.com/t/ign_es/screenshot/default/porrtada_8v5g.1280.jpg','2026-06-10 16:42:21','2026-09-05 16:03:02'),(6,'Resident Evil Requiem','La nueva entrega principal de la saga de terror de Capcom, prometiendo regresar a las raíces de la supervivencia y el pánico psicológico.','2026-02-27','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxV1So1dg5G5WcSBll7xjUr6te3TC0FYQH2SGowz4wKu_5CjhNNnPNjyZj&s=10','2026-06-10 16:42:21','2026-09-07 22:28:07'),(7,'Marathon','El shooter de extracción de ciencia ficción multijugador en primera persona desarrollado por Bungie.','2026-03-05','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnCzb3M3tKoSkJy3AfC9YSquMlp6eDiEo_A03oBR2J58i6VnC4MyK2L7uD&s=10','2026-06-10 16:42:21','2026-09-07 22:27:28'),(8,'Crimson Desert','Un juego de acción y aventura en un mundo abierto medieval desarrollado por Pearl Abyss que narra la lucha por la supervivencia en Pywel.','2026-03-19','https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3321460/c0f0866161be038cc6607824505b0cb51cd12cf0/capsule_616x353.jpg?t=1788450739','2026-06-10 16:42:21','2026-09-05 16:05:40'),(9,'Starfield (PS5 Edition)','La llegada del épico juego de rol espacial de Bethesda Game Studios a la consola PlayStation 5 con todas las actualizaciones y DLC incluidos.','2026-04-07','https://acdn-us.mitiendanube.com/stores/004/136/912/products/starfield-ps5-971d0179c66d174b3617855232172722-480-0.webp','2026-06-10 16:42:21','2026-09-05 16:06:41'),(10,'Forza Horizon 6','La franquicia de velocidad y mundo abierto de Xbox regresa con un nuevo mapa exótico y físicas de conducción de vanguardia.','2026-05-19','https://img.redbull.com/images/c_crop,w_1920,h_960,x_0,y_37/c_auto,w_1200,h_630/f_auto,q_auto/redbullcom/2025/9/26/mhtahgg8zbgibnvcbz2w/forza-horizon-6-artwork','2026-06-10 16:42:21','2026-09-05 16:07:45'),(11,'Mina the Hollower','Una aventura de acción con estética retro desarrollada por Yacht Club Games, creadores de Shovel Knight.','2026-05-29','https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1875580/ba1e750e24c1a6218b22a4777a4020d967b8f1e1/capsule_616x353.jpg?t=1784215061','2026-06-10 16:42:21','2026-09-05 16:09:15'),(12,'Gothic Remake','El regreso triunfal del icónico RPG de Alkimia Interactive en un mundo vivo y peligroso recreado desde cero.','2026-06-05','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAiQDDAfmblZkGqbhtjq3-hf-Dn-tsLuoAWCP9F8TSwQ&s=10','2026-06-10 16:42:21','2026-09-05 16:09:58'),(14,'DOOM: The Dark Ages – Revelations DLC','La primera gran expansión de la precuela del Doom Slayer, expandiendo su arsenal medieval y los escenarios de asedio del infierno.','2026-07-07','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_mR49ADrPw0L77PrSuKymkQU86aPZLPotgAZmsT0LNQ&s=10','2026-06-10 16:42:21','2026-09-05 15:55:27'),(15,'Palworld (1.0 Launch)','El lanzamiento de la versión 1.0 oficial de Palworld tras su exitoso paso por el Acceso Anticipado, con nuevos continentes y Pals.','2026-07-10','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC_2s1NGxhcOVdwxV3jQTzHyunhctbhLAqlp08QYVB3ZtKLKMu8vs4a1jV&s=10','2026-06-10 16:42:21','2026-09-05 00:37:19'),(16,'Elden Ring: Tarnished Edition','Una versión definitiva que recopila el aclamado Elden Ring junto con la expansión Shadow of the Erdtree exclusivamente para Nintendo Switch 2','2026-08-28','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIyy9sghxiOcWD0dRYO9BPmUCuax3wwsAB9ver6-eDVckhrH-QKXOw52w4&s=10','2026-06-10 16:42:21','2026-09-05 00:35:10'),(17,'Grand Theft Auto VI','La próxima entrega de la legendaria serie Grand Theft Auto de Rockstar Games, ambientada en Vice City.','2026-11-19','https://static.wikia.nocookie.net/esgta/images/e/e8/Caratula_GTA_VI.png/revision/latest?cb=20260618141326','2026-06-10 16:42:21','2026-09-05 00:33:02'),(19,'Halloween: The Game','Halloween: The Game es un próximo videojuego de terror y supervivencia desarrollado por IllFonic y publicado por IllFonic Publishing, con Gun Interactive como coeditor.  Está basado en la película Halloween de John Carpenter de 1978 y su lanzamiento está programado para el 8 de septiembre de 2026 para PlayStation 5 , Windows y Xbox Series X y Series S.','2026-09-08','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUYKOqhxBE7MYKi3VFM4B6UG4Hqin2epB5YB1r3n3qCQ&s=10','2026-09-01 17:44:18','2026-09-07 22:45:11'),(20,'The Blood of Dawnwalker','The Blood of Dawnwalker, es un videojuego de rol de acción desarrollado por Rebel Wolves y publicado por Bandai Namco Entertainment. Está ambientado en la Edad Media en el Sudeste de Europa del siglo XIV','2026-09-03','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6xMayJR2FlXO27oQKg68EDqN24nyANekPw61jBr6fA&s=10','2026-09-05 00:45:42','2026-09-07 21:38:54'),(21,'Onimusha: Way of the Sword','Onimusha: Way of the Sword s un próximo juego de acción y aventura desarrollado y publicado por Capcom. Es la primera entrega principal de la serie Onimusha desde Onimusha: Dawn of Dreams','2026-09-04','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnicUBz1nG0TjOVPvYREvouca6iSpnDyMVIGzd7TmnuYluipKc7YLjT4o&s=10','2026-09-05 00:46:28','2026-09-07 21:40:34'),(22,'Marvel\'s Wolverine','Marvel\'s Wolverine es un videojuego de próxima aparición desarrollado por Insomniac Games y publicado por Sony Interactive Entertainment. Basado en el personaje de Marvel Comics Wolverine, está inspirado en la mitología de los cómics de larga data, aunque también deriva de varias adaptaciones en otros medios','2026-09-15','https://acdn-us.mitiendanube.com/stores/455/350/products/ps5-2-c7f1d60cb9d9c11c9617804971407171-640-0.webp','2026-09-05 00:47:22','2026-09-07 21:42:56'),(23,'Fire Emblem: Fortune\'s Weave','Fire Emblem: Fortune\'s Weave es un videojuego de rol táctico que Nintendo lanzará próximamente para Nintendo Switch 2. Ambientado en el Imperio Dagdan, su trama gira en torno a los Juegos Heroicos, en los que cuatro protagonistas jugables participan para conseguir lo que desean','2026-09-17','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQebIR73LrBXWuh294sT24ZF2oTJiEY5CinWZisLm_WPA&s=10','2026-09-05 00:48:50','2026-09-07 21:44:06'),(25,'Silent Hill: Townfall','Silent Hill: Townfall es un próximo juego de terror y supervivencia que se lanzará en 2026, desarrollado por Screen Burn Interactive y publicado por Konami Digital Entertainment y Annapurna Interactive. El juego es un spin-off independiente de la franquicia Silent Hill','2026-09-24','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdLKf5738GMkss35pQmUuC3ViCtdBq3PXdk_L7__Yt1g4sL1izvWbeZWw&s=10','2026-09-05 00:50:34','2026-09-07 21:46:09'),(26,'Control Resonant','Control Resonant es un próximo juego de rol de acción desarrollado y publicado por Remedy Entertainment. Es la secuela del juego Control de 2019 y su lanzamiento está previsto para macOS, PlayStation 5, Windows y Xbox Series X/S en 2026','2026-09-24','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkhBLAxa5MBwgzD6qGrlkwwsQRiJaLmArEKH_UI_Sudsabh27qH96VtNo5&s=10','2026-09-05 00:51:23','2026-09-07 21:49:57'),(27,'Gears of War: E-Day','Gears of War: E-Day es un videojuego de disparos en tercera persona desarrollado por The Coalition y People Can Fly, y publicado por Xbox Game Studios. Es la sexta entrega principal de la saga Gears of War y sirve como precuela del Gears of War original.','2026-10-06','https://images.augustman.com/wp-content/uploads/sites/3/2026/06/10175709/Gears-of-War-2-1.jpg','2026-09-05 00:51:59','2026-09-07 22:01:08'),(28,'Castlevania: Belmont\'s Curse','Castlevania: Belmont\'s Curse es un próximo juego de acción y aventura desarrollado por Evil Empire y publicado por Konami. Es la vigésimo sexta entrega principal de la franquicia Castlevania','2026-10-15','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShA55b6UvPds_gd-2Dkp63mLRI0xhM5N0OYHj0jzzX7--NRGG5txE47vI&s=10','2026-09-05 16:12:12','2026-09-07 22:13:39'),(29,'Phantom Blade Zero','Phantom Blade Zero es un próximo videojuego de rol de acción con elementos de hack and slash, que se encuentra en desarrollo por el estudio chino S-GAME para las plataformas Windows y PlayStation 5','2026-10-28','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzIK5dePJGqkHdJNk5m2nLrtIe07mmb9pd4Vrh_6WDkh7Km1AQgfGIS7A&s=10','2026-09-05 16:12:52','2026-09-07 22:16:13'),(30,'Ace Combat 8: Wings of Theve','Ace Combat 8: Wings of Theve Es el decimoctavo juego de la serie Ace Combat, se trata de un videojuego arcade de simulación de vuelo de combate en fase de desarrollo por Namco Project Aces','2026-10-06','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD47K78mcCBDiw8iz2g1ZWao8Q6e93xj56ZHAgO_RQjg&s','2026-09-05 16:29:11','2026-09-07 22:06:54'),(31,'Star Wars: Galactic Racer','Star Wars: Galactic Racer es un videojuego de carreras con elementos de aventura desarrollado por Fuse Games y publicado por Secret Mode. Ambientado en el universo de Star Wars','2026-10-08','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLizRZrPoFuDSHgRWA21h8hjB0W98MVzPnHT4dQNCxM9sz0wp6vzT0j4mO&s=10','2026-09-05 16:29:45','2026-09-07 22:09:23'),(32,'Clive Barker\'s Hellraiser: Revival','Clive Barker\'s Hellraiser: Revival es un videojuego de acción y terror en primera persona desarrollado y publicado por Saber Interactive','2026-10-08','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSoH_6u1poT2UgR2ggEOydXQiHw9Yb9mQA1hYR3p-7tNNTDxO7QsgkUGM&s=10','2026-09-05 16:30:13','2026-09-07 22:12:34'),(33,'Call of Duty: Modern Warfare 4','Call of Duty: Modern Warfare 4 es un juego de disparos en primera persona desarrollado por Infinity Ward y publicado por Activision. Es la vigésimo tercera entrega de la serie Call of Duty y la cuarta de la subsaga Modern Warfare, que ha sido reiniciada, después de Call of Duty: Modern Warfare III','2026-10-23','https://gaming-cdn.com/images/news/articles/19779/cover/call-of-duty-modern-warfare-4-saldra-el-23-de-octubre-de-2026-cover6a185f7a8ae4a.jpg','2026-09-05 16:30:48','2026-09-07 22:15:02'),(34,'Warhammer 40,000: Dawn of War IV','Warhammer 40,000: Dawn of War IV es un videojuego de estrategia en tiempo real desarrollado por King Art Games y publicado por Deep Silver. Esta cuarta entrega de la serie Warhammer 40,000: Dawn of War se lanzará para PC con Windows a través de Steam el 3 de diciembre de 2026','2026-12-03','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnZBg9YL29Lv5-S5QBSy6lB5cVmcCu6GImJwiWXNVC45O7RTA3z9PG1IQJ&s=10','2026-09-05 16:31:13','2026-09-07 22:22:27'),(35,'The Binding of Isaac: Repentance+ ','Se lanzará la edición definitiva Repentance+ Online para PlayStation 5, Xbox Series X/S y la nueva Nintendo Switch 2. Esta versión incluirá todo el contenido previo adaptado nativamente con multijugador en línea y contará con una edición física exclusiva para la consola de Nintendo','2026-11-19','https://static.wikia.nocookie.net/bindingofisaac/images/c/ce/RepentanceTitulo.jpg/revision/latest?cb=20200815181353&path-prefix=es','2026-09-05 16:33:16','2026-09-07 22:20:52'),(36,'Metal Gear Solid: Master Collection Vol.2',' Esta segunda entrega recopila títulos clave de la saga de sigilo de Konami que no habían tenido versiones modernas en múltiples plataformas','2026-08-27','https://i.ytimg.com/vi/a3AujdsJvjI/maxresdefault.jpg','2026-09-07 21:58:46','2026-09-07 21:58:46'),(37,'WARDOGS','El videojuego WARDOGS es un shooter táctico en primera persona desarrollado por Bulkhead y distribuido por Team17','2026-09-10','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBu-f9aqtvu3j1uu3HV-p41JcNKUgUIEx-aJYWUJ_Hk3LeiMk2bryjGOY&s=10','2026-09-07 22:37:13','2026-09-07 22:37:13'),(38,'Bus Simulator 27','Bus Simulator 27 es un videojuego de simulación de autobuses desarrollado por la compañía polaca Simteract y distribuido por la alemana Astragon','2026-09-08','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkjCTWJXT19zX0lMi-uHsF-Gdgb3ehovnNYE-9SrSNGstOaiJXL3yfsd8_&s=10','2026-09-07 22:39:30','2026-09-07 22:39:30'),(39,'Monster Hunter Wilds','Monster Hunter Wilds es un videojuego de rol de acción desarrollado y distribuido por Capcom. Es parte de la franquicia Monster Hunter y sucesor de Monster Hunter Rise','2026-12-04','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQMeAdw87k3NsxetrU_J5V9Z6jTmdlqnsIzjd_syj_hN-97C_W3vDeeE0&s=10','2026-09-09 21:50:33','2026-09-09 22:26:21'),(40,'Meccha Chameleon: Nintendo Switch 2','Es un videojuego independiente de género casual desarrollado por el desarrollador japonés Lemorion_1224 con la ayuda de Haganeiro. Fue lanzado el 10 de junio de 2026 para PC. ','2026-09-09','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSon57sCoZyRau0eeuEBfwbGfHhKIAvI4XNHimGCey_hH3Wz-ITIPJoS-o&s=10','2026-09-09 21:53:17','2026-09-09 22:09:08'),(41,'The Witcher 3 Remastered','The Witcher 3: Wild Hunt es un videojuego de rol desarrollado y publicado por la compañía polaca CD Projekt RED. El remaster será gratis para los usuarios que ya cuenten con el juego original.','2026-09-29','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEDZZ53TIbRae62awAD-rnj0LRcFVCAvCzv7zd403r1g&s','2026-09-09 21:56:18','2026-09-09 22:12:15'),(42,'Professor Layton and The New World of Steam','','2026-12-10','','2026-09-09 21:58:43','2026-09-09 21:58:43'),(43,'Xenoblade Chronicles 3: Switch 2 Edition','Xenoblade Chronicles 3 es un videojuego de rol desarrollado por Monolith Soft y publicado por Nintendo para la consola de videojuegos Nintendo Switch y Switch 2','2026-12-03','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRwv6hDaOW-f5Nxj8sGePH5kAHrpxZ2plnEshkmGwxu9K3CpjIHbz03cVj&s=10','2026-09-09 22:00:27','2026-09-09 22:21:30'),(44,'Resident Evil 2 Remake Deluxe Edition','Resident Evil 2 —cuyo título original en Japón es Biohazard RE:2 —​ es un videojuego de terror y supervivencia de disparos en tercera persona desarrollado y publicado por Capcom','2026-10-16','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9LFa3FdBDPv9QIWBPsHNF1nEi0ptCg87Vx2-IzPrFeyS9cVZRQh0KuyM&s=10','2026-09-09 22:03:18','2026-09-09 22:14:49'),(45,'Resident Evil 3 Remake','Resident Evil 3 —cuyo título original en Japón es Biohazard RE: 3 —​ es un videojuego de acción y aventura de disparos en tercera persona de terror y supervivencia desarrollado y publicado por Capcom. Es un remake del juego de 1999 Resident Evil 3: Nemesis','2026-10-16','https://www.clarin.com/img/2019/12/03/Glb6Ejtf_720x0__1.jpg','2026-09-09 22:03:37','2026-09-09 22:19:15'),(46,'Resident Evil 4 Remake Gold Edition','Resident Evil 4 — conocido en Japón como Biohazard 4 — es un videojuego de acción-aventura de disparos en tercera persona de terror y supervivencia desarrollado y publicado por Capcom para la GameCube','2026-10-16','https://img.youtube.com/vi/YDqiDppihbk/maxresdefault.jpg','2026-09-09 22:04:08','2026-09-09 22:20:08'),(47,'The Legend of Zelda: Ocarina of Time Remake','','2026-11-05','','2026-09-21 15:24:40','2026-09-21 15:24:40');
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platforms`
--

DROP TABLE IF EXISTS `platforms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `platforms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platforms`
--

LOCK TABLES `platforms` WRITE;
/*!40000 ALTER TABLE `platforms` DISABLE KEYS */;
INSERT INTO `platforms` VALUES (9,'Android'),(10,'iOS'),(4,'Nintendo Switch'),(7,'Nintendo Switch 2'),(1,'PC'),(5,'PlayStation 4'),(2,'PlayStation 5'),(8,'VR/Meta Quest'),(6,'Xbox One'),(3,'Xbox Series X/S');
/*!40000 ALTER TABLE `platforms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_favorite_events`
--

DROP TABLE IF EXISTS `user_favorite_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_favorite_events` (
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`event_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `user_favorite_events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_favorite_events_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_favorite_events`
--

LOCK TABLES `user_favorite_events` WRITE;
/*!40000 ALTER TABLE `user_favorite_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_favorite_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_favorite_games`
--

DROP TABLE IF EXISTS `user_favorite_games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_favorite_games` (
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`game_id`),
  KEY `game_id` (`game_id`),
  CONSTRAINT `user_favorite_games_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_favorite_games_ibfk_2` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_favorite_games`
--

LOCK TABLES `user_favorite_games` WRITE;
/*!40000 ALTER TABLE `user_favorite_games` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_favorite_games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('ROL_USUARIO','ROL_ADMIN') NOT NULL DEFAULT 'ROL_USUARIO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@gamerfest.com','$2b$10$MBk9ZURBLZPJEHTPaGLcnOTioh.tPE/sZS98j.Oh7kN5Fy/d5pEnm','ROL_ADMIN','2026-06-10 16:42:21','2026-06-10 16:42:21'),(2,'gamer','gamer@gmail.com','$2b$10$HLby0CoCRKv8F.EJEdsH1OaM4lZTDBCUamarorizIWbWeVbOINTk6','ROL_USUARIO','2026-06-10 16:42:21','2026-06-10 16:42:21');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-27 18:33:12
