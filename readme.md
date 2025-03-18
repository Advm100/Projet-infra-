## Projet VPN 
```
connexion SSH : 

PS C:\Users\user> ssh hugo@192.168.1.150
hugo@192.168.1.150 password:
Welcome to Ubuntu 24.04.2 LTS (GNU/Linux 6.11.0-19-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

La maintenance de sécurité étendue pour Applications n'est pas activée.

0 mise à jour peut être appliquée immédiatement.

8 mises à jour de sécurité supplémentaires peuvent être appliquées avec ESM Apps.
En savoir plus sur l'activation du service ESM Apps at https://ubuntu.com/esm

Last login: Thu Mar  6 16:56:35 2025 from 192.168.56.1
```

```
Installation et Configuration du Serveur VPN :  

hugo@hugo-VirtualBox:~$ sudo apt update && sudo apt upgrade -y
[sudo] Mot de passe de hugo :
Atteint :1 http://security.ubuntu.com/ubuntu noble-security InRelease
Atteint :2 http://fr.archive.ubuntu.com/ubuntu noble InRelease
Atteint :3 http://fr.archive.ubuntu.com/ubuntu noble-updates InRelease
Atteint :4 http://fr.archive.ubuntu.com/ubuntu noble-backports InRelease
Lecture des listes de paquets... Fait
Construction de l'arbre des dépendances... Fait
Lecture des informations d'état... Fait
Tous les paquets sont à jour.
Lecture des listes de paquets... Fait
Construction de l'arbre des dépendances... Fait
Lecture des informations d'état... Fait
Calcul de la mise à jour... Fait
Les paquets suivants ont été installés automatiquement et ne sont plus nécessaires :
  libllvm17t64 python3-netifaces
Veuillez utiliser « sudo apt autoremove » pour les supprimer.
Get more security updates through Ubuntu Pro with 'esm-apps' enabled:
  libcjson1 libpostproc57 libavcodec60 libavutil58 libswscale7 libswresample4
  libavformat60 libavfilter9
Learn more about Ubuntu Pro at https://ubuntu.com/pro
0 mis à jour, 0 nouvellement installés, 0 à enlever et 0 non mis à jour.
```
```
activer le routage : 

hugo@hugo-VirtualBox:~$ echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
net.ipv4.ip_forward=1
net.ipv4.ip_forward = 1
```

```
Installation d’OpenVPN : 

hugo@hugo-VirtualBox:~$ sudo apt install openvpn easy-rsa -y
Lecture des listes de paquets... Fait
Construction de l'arbre des dépendances... Fait
Lecture des informations d'état... Fait
openvpn est déjà la version la plus récente (2.6.12-0ubuntu0.24.04.1).
openvpn passé en « installé manuellement ».
Les paquets suivants ont été installés automatiquement et ne sont plus nécessaires :
  libllvm17t64 python3-netifaces
Veuillez utiliser « sudo apt autoremove » pour les supprimer.
Les paquets supplémentaires suivants seront installés :
  libccid libeac3 opensc opensc-pkcs11 pcscd
Les NOUVEAUX paquets suivants seront installés :
  easy-rsa libccid libeac3 opensc opensc-pkcs11 pcscd
0 mis à jour, 6 nouvellement installés, 0 à enlever et 0 non mis à jour.
```
