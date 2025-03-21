#                                         SECURE VPN

##    On va commencer par configurer un VPN à l'aide de simple machine virtuelles, des RockyLinux suffiront


#### on va creer exactement 4 VM, la première va servir de routeur connecté à internet et liée à 2 LAN, le LAN1 va conserver l'adresse du dns et servir un serveur web dédié au vpn grâce à 2 VM distincte, le LAN2 va servir heberger un serveur dhcp et les différent clients qui voudront se connecter au vpn, voici le procédé :

##### une fois que les VM sont allumées, on va leur configurer leur cartes réseaux, le routeur en contient 2 pour sa part et les adresse ip des ses cartes vont servir de passerelle pour les autres VM, sa première carte réseau representera le LAN1 et sa deuxième le LAN2, schématisons le tout !!

![image](files://C:\Users\ahang\Downloads\lab1_tp6.drawio(1).svg)

| Machine          | LAN1 `10.6.1.0/24` | LAN2 `10.6.2.0/24` |
|------------------|--------------------|--------------------|
| `dhcp.tp6.b1`    | `10.6.1.253`       | x                  |
| `client1.tp6.b1` | DHCP               | x                  |
| `routeur.tp6.b1`  | `10.6.1.254`       | `10.6.2.254`       |
| `web.tp6.b1`     | x                  | `10.6.2.11`        |
| `dns.tp6.b1`     | x                  | `10.6.2.12`        |
| Votre PC         | `10.6.1.1`         | `10.6.2.1`         |