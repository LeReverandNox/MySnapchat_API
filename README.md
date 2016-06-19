# MySnapchat_API - Documentation

 - [Intro](#intro)
 - [Connexion](#connexion)
 - [Envoyer un snap'](#send-snap)
 - [Récupérer les snaps' reçus](#get-snaps)
 - [Récupérer la liste des utilisateurs](#get-users)
 - [Valider la vue d'un snap'](#validate-snap)
 - [Récupérer les informations d'un utilisateur](#get-user)
 - [Modifier son mot de passe](#change-password)
 - [Récupérer sa liste d'amis](#get-friends)
 - [Ajouter un ami](#add-friend)
 - [Supprimer un ami](#delete-friend)
 - [Récupérer ses demandes d'ami](#get-friend-requests)
 - [Valider une demande d'ami](#validate-friend)
 - [Refuser une demande d'ami](#refuse-friend)

## Intro <a name="intro"></a>
Les réponses de l'API seront au format suivant :
```json
{
    "error" :  // false si pas d'erreur, sinon, un tableau des erreurs (strings)
    "data" : // Un objet contenant les données demandés, sinon un tableau d'objet en cas de données multiples
    "token" : // Pour la connexion seulement
}
```
La base de l'URL sera a  adapté en fonction de la configuration votre serveur !
Dans les examples de la documentation, nous assumerons que votre API se situe à l'URL : http://localhost:8080/
## Connexion <a name="connexion"></a>
##### POST http://localhost:8080/api/users/login

Champs attendus :
```json
{
    "email": "johndoe@tld.com", // Votre email
    "password": "yoursecretpassword" // Votre mot de passe
}
```
Retourne :
```json
{
    "error": false,
    "data": {
        "id": 1,
        "username": "darealuno",
        "email": "johndoe@tdl.com"
    },
    "token": "yoursecrettoken"
}
```

## Inscription <a name="inscription"></a>
##### POST http://localhost:8080/api/users/register

Champs attendus :
```json
{
    "email": "johndoe@tld.com", // Votre email
    "username": "darealuno", // Votre nom d'utilisateur
    "password": "yoursecretpassword" // Votre mot de passe
}
```
Retourne :
```json
{
    "error": false,
    "data": {
        "id": 3,
        "username": "darealuno",
        "email": "johndoe@tld.com"
    }
}
```

## Envoyer un snap' <a name="send-snap"></a>
##### POST http://localhost:8080/api/snaps

Champs attendus :
```json
{
    "token": "yoursecrettoken", // Votre token
    "email": "johndoe@tld.com", // Votre email
    "password": "yoursecretpassword", // Votre mot de passe
    "u2": "1;2;3", // Une chaine d'ID des destinataires séparés par le charactère ';'
    "temps": 7 // La durée du snap exprimée en secondes (entre 1 et 10s)
}
```
Retourne :
```json
{
    "error": false,
    "data": null
}
```

## Récupérer les snaps' reçus <a name="get-snaps"></a>
##### GET http://localhost:8080/api/snaps

Champs attendus :

?**token**=yoursecrettoken&**email**=johndoe@tld.com

Retourne :
```json
{
    "error": false,
    "data": [
        {
            "id": 1,
            "url": "http://localhost:8080/uploads/imagename.jpeg",
            "duration": 7,
            "sender": {
                "username": "johndoe",
                "email": "johndoe@tld.com"
            }
        },
        ...
    ]
}
```

## Récupérer la liste des utilisateurs <a name="get-users"></a>
##### GET http://localhost:8080/api/users

Champs attendus :

?**token**=yoursecrettoken

Retourne :
```json
{
    "error": false,
    "data": [
        {
            "id": 1,
            "email": "johndoe@tld.com",
            "username": "johndoe"
        },
        ...
    ]
}
```

## Valider la vue d'un snap' <a name="validate-snap"></a>
##### PATCH http://localhost:8080/api/snaps/:snap_id

Champs attendus :
```json
:snap_id : L'id du snap à valider
{
    "token": "yoursecrettoken", // Votre token
    "email": "johndoe@tld.com" // Votre email
}
```

Retourne :
```json
{
    "error": false,
    "data": null
}
```

## Récupérer les informations d'un utilisateur <a name="get-user"></a>
##### GET http://localhost:8080/api/users/:user_id

Champs attendus :

?**token**=yoursecrettoken

Retourne :
```json
:user_id : L'id de l'utilisateur à récupérer
{
    "error": false,
    "data": {
        "id": 1,
        "username": "johndoe",
        "email": "johndoe@tld.com"
    }
}
```

## Modifier son mot de passe <a name="change-password"></a>
##### PATCH http://localhost:8080/api/users/:user_id

Champs attendus :
```json
:user_id : Votre id

{
    "token": "yoursecrettoken", // Votre token
    "password": "yournewpassword" // Votre nouveau mot de passe
}
```

Retourne :
```json
{
    "error": false,
    "data": null
}
```

## Récupérer sa liste d'amis <a name="get-friends"></a>
##### GET http://localhost:8080/api/friends

Champs attendus :

?**token**=yoursecrettoken

Retourne :
```json
{
    "error": false,
    "data": [
        {
            "id": 1,
            "username": "johndoe",
            "email": "johndoe@tld.com"
        },
        ...
    ]
}
```

## Ajouter un ami <a name="add-friend"></a>
##### POST http://localhost:8080/api/friends/

Champs attendus :
```json
{
    "token": "yoursecrettoken", // Votre token
    "email": "yourfriendemail" // L'email de l'ami que vous souhaitez ajouter
}
```

Retourne :
```json
{
    "error": false,
    "data": null
}
```

## Supprimer un ami <a name="delete-friend"></a>
##### DELETE http://localhost:8080/api/friends/:user_id

Champs attendus :
```json
:user_id : l'id de l'ami à supprimer
{
    "token": "yoursecrettoken" // Votre token
}
```

Retourne :
```json
{
    "error": false,
    "data": null
}
```

## Récupérer ses demandes d'ami <a name="get-friend-requests"></a>
##### GET http://localhost:8080/api/friends/requests

Champs attendus :

?**token**=yoursecrettoken

Retourne :
```json
{
    "error": false,
    "data": [
        {
            "id": 1,
            "username": "johndoe",
            "email": "johndoe@tld.com"
        },
        ...
    ]
}
```

## Valider une demande d'ami <a name="validate-friend"></a>
##### PATCH http://localhost:8080/api/friends/requests/:user_id

Champs attendus :
```json
:user_id : l'id de l'ami à valider
{
    "token": "yoursecrettoken" // Votre token
}
```

Retourne :
```json
{
    "error": false,
    "data": null
}
```

## Refuser une demande d'ami <a name="refuse-friend"></a>
##### DELETE http://localhost:8080/api/friends/requests/:user_id

Champs attendus :
```json
:user_id : l'id de l'ami à refuser
{
    "token": "yoursecrettoken" // Votre token
}
```

Retourne :
```json
{
    "error": false,
    "data": null
}
```