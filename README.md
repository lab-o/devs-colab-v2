# Devs cO'LAB v2

[C'est quoi les Devs cO'LAB ? / What are Devs cO'LAB ?](https://github.com/lab-o/devs-colab/tree/master/)

[C'est quoi ce projet-là ?](https://github.com/lab-o/devs-colab/tree/master/v2)


## Comment installer?
Il faut:

- Docker (Pour les ateliers, nous utilisons Docker Toolbox plutôt que Docker for Windows)
- node.js

Puis suivre ces instructions:

- Récupérer le code source
- Aller dans le dossier tweetLoader et lancer `npm install`
- Définissez l'option `vm.max_map_count` à une valeur correcte en suivant les instructions de l'encadré "Important" de [ce tutoriel](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#docker-cli-run-prod-mode)
- Remonter à la racine, et lancer `docker-compose up`
