module.exports = {
    rpcUpdate: function (data, version) {
        let details;
        let state;
        let buttonLabel = 'Aller sur la page';
        let buttonUrl = 'https://www.habbocity.me' + data.pathname.toLowerCase();

        if (data.pathname.toLowerCase() === "/" || data.pathname.toLowerCase() === "/index") {
            details = 'Accueil - Connexion';
            state = 'Se connecte à HabboCity';
        }

        if (data.pathname.toLowerCase() === "/hotel") {
            details = "Hôtel";
            state = "Joue sur l'hôtel";
            if (data.elements[0] && data.elements[1]) {
                state = 'Joue sur l\'hôtel : ' + data.elements[0];
                buttonLabel = 'Rejoindre l\'appartement';
                buttonUrl = 'https://www.habbocity.me/room/' + data.elements[1];
            }
        }

        if (data.pathname.toLowerCase() === "/register") {
            details = 'Accueil - Inscription'
            state = 'S\'inscrit sur HabboCity';

            const registername = data.elements[0];
            if (registername && registername != "") {
                state = 'S\'inscrit sur HabboCity - ' + registername;
            }
        }

        if (data.pathname.toLowerCase() === "/conditions") {
            details = 'Conditions';
            state = 'Lit les conditions d\'utilisations';
        }

        if (data.pathname.toLowerCase() === "/pin") {
            details = 'PIN';
            state = 'Entre son code PIN';
        }

        if (data.pathname.toLowerCase() === "/profil") {
            details = 'Profil - ' + data.title.replace('HabboCity:', '');
            state = 'Regarde sa page personnelle';
        }

        if (data.pathname.toLowerCase() === "/discord") {
            details = "Discord - CityCOM";
            state = "Rejoins le serveur discord CityCOM";
        }

        if (data.pathname.toLowerCase().startsWith("/profil/")) {
            details = "Profil - " + data.title;
            state = "Regarde le profil de " + data.title;
            if (data.elements[0] && data.elements[0] === "block") {
                if (data.elements[1]) {
                    if (data.elements[1] === "Mes apparts") {
                        state = "Regarde les appartements de " + data.title;
                    } else if (data.elements[1] === "Mes groupes") {
                        state = "Regarde les groupes de " + data.title;
                    }
                }
            }
        }

        if (data.pathname.toLowerCase() === "/meet") {
            details = "Meet";
            state = "Regarde les relations les plus populaires de l'hôtel";
            const meet = data.elements[0];
            if (meet && meet != "") {
                details = "Meet - " + meet;
                state = "Regarde les relations de " + meet;
            }
        }

        if (data.pathname.toLowerCase() === "/news") {
            details = "Nouveautés";
            state = "Regarde les dernières nouveautés";
            if (data.elements[0] && data.elements[0] === "block") {
                const search = data.elements[1];
                if (search && search != "") {
                    details = "Nouveautés - Recherche";
                    state = "Recherche l'article : \"" + search + '"';
                }
            }
        }

        if (data.pathname.toLowerCase().startsWith("/news/")) {
            details = "Nouveautés - Article";
            state = "Lit l'article : " + data.title;
        }

        if (data.pathname.toLowerCase() === "/community/team") {
            details = "Communauté - Équipe";
            state = "Regarde la page équipe";
        }

        if (data.pathname.toLowerCase() === "/community/fansites") {
            details = "Communauté - Organisations";
            state = "Regarde la page des organisations";
            if (data.elements[0] && data.elements[0] === "block") {
                state = "Propose son organisation";
                const nameorga = data.elements[1];
                if (nameorga && nameorga != "") {
                    state = "Propose son organisation - " + nameorga;
                }
            }
        }

        if (data.pathname.toLowerCase() === "/community/fansites/new") {
            details = "Communauté - Organisations";
            state = "Ajoute un article à la page \"Organisations\"";
            /*const titlearticle = data.elements[0];
            if (titlearticle && titlearticle != "") {
                state = "Ajoute un article à la page organisations - " + titlearticle;
            }*/
        }

        if (data.pathname.toLowerCase() === "/organisationteam") {
            details = "Communauté - Collaborateurs";
            state = "Regarde la page des collaborateurs";
        }

        if (data.pathname.toLowerCase() === "/prestige/joueurs") {
            details = "Prestige - Joueurs";
            state = "Regarde la page des joueurs prestigieux";
        }

        if (data.pathname.toLowerCase() === "/prestige/appartements") {
            details = "Prestige - Appartements";
            state = "Regarde la page des appartements prestigieux";
        }

        if (data.pathname.toLowerCase() === "/prestige/gamer") {
            details = "Prestige - Gamers";
            state = "Regarde la page des meilleurs aux animations";
        }

        if (data.pathname.toLowerCase() === "/prestige/riches") {
            details = "Prestige - Riches";
            state = "Regarde la page des joueurs les plus riches";
        }

        if (data.pathname.toLowerCase() === "/forum") {
            details = "Forum - Accueil";
            state = "Regarde la liste des sujets";
            if (data.elements[0] === "block") {
                const search = data.elements[1];
                if (search && search != "") {
                    details = "Forum - Recherche";
                    state = 'Recherche le sujet : "' + search + '"';
                }
            }
        }

        if (data.pathname.toLowerCase().startsWith("/forum/")) {
            if (!data.pathname.toLowerCase().startsWith("/forum/categorie")) {
                const page = data.pathname.toLowerCase().split("/");
                let nbpage = page[3];
                if (nbpage === undefined) {
                    nbpage = "1";
                }
                details = "Forum - Sujet";
                state = "Lit le sujet : " + data.title.replace("- HabboCity", "").replace("Page " + nbpage, "") + " - Page " + nbpage;
            }
        }

        if (data.pathname.toLowerCase().startsWith("/forum/categorie")) {
            details = "Forum - Catégories";
            if (data.title === "Forum de HabboCity") {
                state = "Regarde la liste des sujets";
            } else {
                const page = data.pathname.toLowerCase().split("/");
                const nbpage = page[4];
                state = "Regarde la liste des sujets - " + data.title.replace("HabboCity:", "") + " - Page " + nbpage;
            }
        }

        if (data.pathname.toLowerCase().startsWith("/forum/categorie/com/")) {
            const page = data.pathname.toLowerCase().split("/");
            const nbpage = page[4];
            details = "Forum - Mes sujets commentés";
            state = "Regarde ses sujets commentés - Page " + nbpage;
        }

        if (data.pathname.toLowerCase().startsWith("/forum/categorie/mes/")) {
            const page = data.pathname.toLowerCase().split("/");
            const nbpage = page[4];
            details = "Forum - Mes sujets";
            state = "Regarde ses sujets - Page " + nbpage;
        }

        if (data.pathname.toLowerCase() === "/forum/new-sujet") {
            const title = data.elements[0];
            const category = data.elements[1];
            const nbcategory = {
                "1": "Discussion générale",
                "138": "Débats & sondages",
                "4": "Idées & suggestions",
                "8": "RPG & Sites de fans",
                "5": "Économie & Casinos",
                "9": "Jeux & événements",
                "7": "Artistique",
                "137": "Tutoriels",
                "136": "Aide"
            };
            details = "Forum - Nouveau sujet";
            if (title && title != "") {
                state = "Crée un nouveau sujet dans " + nbcategory[category] + " - " + title;
            } else {
                state = "Crée un nouveau sujet dans " + nbcategory[category];
            }
        }

        if (data.pathname.toLowerCase() === "/boutique") {
            details = "Boutique - Accueil";
            state = "Parcoure la boutique";
        }

        if (data.pathname.toLowerCase() === "/boutique/citycash") {
            details = "Boutique - CityCash";
            state = "Achète des CityCash";
        }

        if (data.pathname.toLowerCase() === "/boutique/coffres") {
            details = "Boutique - Coffres";
            state = "Regarde les coffres disponibles";
        }

        if (data.pathname.toLowerCase() === "/boutique/bonamigo") {
            details = "Boutique - Bonamigo";
            state = "Joue au Bonamigo";
        }

        if (data.pathname.toLowerCase() === "/boutique/badges") {
            details = "Boutique - Badges";
            state = "Regarde les badges disponibles";
        }

        if (data.pathname.toLowerCase() === "/boutique/marche") {
            details = "Boutique - Marché";
            state = "Regarde le marché";
        }

        if (data.pathname.toLowerCase() === "/boutique/economie") {
            details = "Boutique - Économie";
            state = "Regarde l'économie";
        }

        if (data.pathname.toLowerCase() === "/boutique/citybox") {
            details = "Boutique - CityBox";
            state = "Regarde les avantages de la CityBox";
        }

        if (data.pathname.toLowerCase() === "/deconnexion") {
            details = "Déconnexion";
            state = "Se déconnecte de HabboCity";
        }

        if (data.pathname.toLowerCase() === "/settings") {
            details = "Paramètres";
            state = "Paramètre son compte";
            console.log(data.elements);
            if (data.elements[0] && data.elements[0] === "block" && data.elements[1]) {
                if (data.elements[1] === "Mon mot de passe") {
                    details = "Paramètres - Mot de passe";
                    state = "Modifie son mot de passe";
                } else if (data.elements[1] === "Mon adresse email") {
                    details = "Paramètres - E-mail";
                    state = "Modifie son adresse mail";
                } else if (data.elements[1] === "Code pin") {
                    details = "Paramètres - Code PIN";
                    state = "Modifie son code PIN";
                } else if (data.elements[1] === 'Mes amis') {
                    details = "Paramètres - Amis";
                    state = "Gère sa liste d'amis";
                }
            }
        }

        if (data.cityclub && data.cityclub === true) {
            details = "Boutique - CityClub";
            state = "Adhère au CityClub";
        }

        if (data.pathname.toLowerCase().startsWith("/boutique")) {
            /*if (data.elements[0] && data.elements[0] === "block" && data.elements[1] !== '') {
                details = "Boutique - Mon inventaire";
                state = "Recherche : " + data.elements[1];
            }*/
            if (data.elements[0] === "block" && data.elements[1] === 'b168') {
                details = "Boutique - Coffres";
                state = "Achète un coffre";
            }
            if (data.elements[0] === "block" && data.elements[1] === 'b280') {
                details = "Boutique - Banque";
                state = "Convertit sa monnaie";
            }
            /*if (data.elements[0] === "block" && data.elements[1] === 'b104x') {
                details = "Boutique - Mon inventaire";
                state = "Regarde ses mobiliers";
            }
            if (data.elements[0] === "block" && data.elements[1] === 'b104') {
                details = "Boutique - Mon inventaire";
                state = "Regarde ses badges";
            }
            if (data.elements[0] === "block" && data.elements[1] === 'b106') {
                if (data.elements[2] === "block") {
                    const badgetitle = data.elements[3];
                    const badgecode = data.elements[4];
                    details = "Boutique - Mon inventaire";
                    state = "Vend le badge " + badgetitle + " - " + badgecode.replace(".gif", "");
                }
            }
            if (data.elements[0] === "block" && data.elements[1] === 'b201') {
                details = "Boutique - Mon inventaire";
                state = "Regarde son historique";
            }
            if (data.elements[0] === "block" && data.elements[1] === 'b208') {
                details = "Boutique - Mon inventaire";
                state = "Regarde ses appartements";
            }
            if (data.elements[0] === "block" && data.elements[1] === 'b210') {
                if (data.elements[2] === "block") {
                    details = "Boutique - Mon inventaire";
                    const apparttitle = data.elements[3];
                    const sendto = data.elements[4];
                    if (sendto != "") {
                        state = "Transfère l'appartement \"" + apparttitle + '" à ' + sendto;
                    } else {
                        state = "Vend l'appartement \"" + apparttitle + '" sur le marché';
                    }
                }
            }*/
        }

        if (data.fil === true && data.elements[0] === "0px") {
            details = "Fil d'actualité";
            if (data.elements[1] === 'fil36') {
                if (data.elements[2] === "fil34" || data.elements[2] === "fil35") {
                    if (data.elements[2] === "fil34") {
                        state = "Regarde le fil d'actualité";
                    }
                    if (data.elements[2] === "fil35") {
                        state = "Regarde ses notifications";
                    }
                } else {
                    state = "Regarde les nouveautés";
                }
            }
            if (data.elements[3] === "fil25") {
                if (data.elements[4].replace(' ', '') != "" && data.elements[4].toLowerCase() != "écrire quelque chose...") {
                    state = 'Écrit un Tweet - "' + data.elements[4] + '"';
                }
            }
        }

        if (data.photos === true && data.elements[0] === "block") {
            details = "City Stories - Mes photos";
            state = "Regarde ses photos";
            if (data.elements[1] && data.elements[1] !== "block") {
                state = 'Édite une photo : "' + data.elements[1] + '"';
            }
        }

        if (data.story === true && data.elements[0] === "block") {
            details = "City Stories";
            if (data.elements[1]) {
                state = "Regarde la story de " + data.elements[1];
            } else {
                state = "Regarde sa story";
            }
        }

        if (data.sponso === true && data.elements[0] === "block") {
            const link = data.elements[1];
            details = "Parrainage";
            state = "Parraine ses amis - https://" + link;
        }

        if (data.helpcenter === true && data.elements[0] === "block") {
            const titlehelp = data.elements[1];
            if (titlehelp) {
                if (titlehelp === "Centre d'aide") {
                    details = "Centre d'aide";
                    state = "Parcoure le centre d'aide";
                }
                if (titlehelp === "Service client") {
                    details = "Centre d'aide - Support";
                    state = "Contacte le support";
                }
                if (titlehelp === "Mon ticket") {
                    details = "Centre d'aide - Mes tickets";
                    state = "Regarde ses tickets";
                }
            }
        }

        if (details === null) {
            details = "Erreur - 404";
            state = "Page introuvable";
        }

        if (data.update && data.update === true) {
            details = "Mise à jour...";
            state = "Version : " + version;
        }

        if (data.details !== null && data.state !== null) {
            return [details, state, buttonLabel, buttonUrl];
        } else {
            return ['Erreur', 'Erreur', 'Erreur', 'Erreur'];
        }
    }
}