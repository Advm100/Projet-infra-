#                                         SECURE VPN
________
________
##    On va commencer par configurer un VPN à l'aide de simple machine virtuelles, des RockyLinux suffiront

________


#### on va creer exactement 4 VM, la première va servir de routeur connecté à internet et liée à 2 LAN, le LAN1 va conserver l'adresse du dns et servir un serveur web dédié au vpn grâce à 2 VM distincte, le LAN2 va servir heberger un serveur dhcp et les différent clients qui voudront se connecter au vpn, voici le procédé :

##### une fois que les VM sont allumées, on va leur configurer leur cartes réseaux, le routeur en contient 2 pour sa part et les adresse ip des ses cartes vont servir de passerelle pour les autres VM, sa première carte réseau representera le LAN1 et sa deuxième le LAN2, schématisons le tout !!

![image](lab1_tp6.drawio(1).svg)

________

### Voici un bon petit tableau d'adressage pour s'organiser

| Machine          | LAN1 `10.6.1.0/24` | LAN2 `10.6.2.0/24` |
|------------------|--------------------|--------------------|
| `dhcp.tp6.b1`    | `10.6.1.253`       | x                  |
| `client1.tp6.b1` | DHCP               | x                  |
| `routeur.tp6.b1`  | `10.6.1.254`       | `10.6.2.254`       |
| `web.tp6.b1`     | x                  | `10.6.2.11`        |
| `dns.tp6.b1`     | x                  | `10.6.2.12`        |
| Votre PC         | `10.6.1.1`         | `10.6.2.1`         |

_________

### Pour vous donner un exemple voici à quoi ressemble la configuration de la carte réseau du dns
```
DEVICE=enp0s3
NAME=LAN2

ONBOOT=yes
BOOTPROTO=static

IPADDR=10.6.2.12
NETMASK=255.255.255.0
GATEWAY=10.6.2.254
DNS1=1.1.1.1
```
__________


### Pour permettre au routeur d'éxecuter sa tâche, activez le routage avec ces 2 commandes :
```
sudo firewall-cmd --add-masquerade --permanent
sudo firewall-cmd --reload
```

## Mettons en route un serveur dhcp !!!

### L'idée ici c'est de pouvoir acceuillir des clients, sinon ce vpn sert à rien, ces gens seront contenus dans le LAN1 et voudront desèsperément avoir accès au réseau, ils vont automatiquement chercher un serveur dhcp si il y en a un, justement, celui que nous allons configurer va leur donner une adresse IP, l'adresse d'un ou plusieurs DNS et celle de la passerelle (routeur), ainsi ils auront tout les élement pour avoir accès au réseau sans problèmes. Enfet, ce procédeé rend les choses plus faciles, il évite que nous ayont à configurer une carte réseaux pour chaque clients qui voudraient avoir accès au vpn, ce serai hyper long.....

> *Mais bref, en suivant les informations sur le site suivant [faut cliquer](https://www.server-world.info/en/note?os=Rocky_Linux_8&p=dhcp&f=1) vous arriverez à l'installer, surtout remplisser la configuration en fonction de votre serveur à vous (passerelle, subnet, etc...)


