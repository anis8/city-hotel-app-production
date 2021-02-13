function updateIframeData(iframeData, iframe, updater) {
    if (iframeData.pathname.toLowerCase() === '/register') {
        if (iframe.document.getElementById('registerusername')) iframeData.elements.push(iframe.document.getElementById('registerusername').value);
    }

    if (iframeData.pathname.toLowerCase().startsWith('/profil/')) {
        if (iframe.document.getElementById('profil87')) iframeData.elements.push(iframe.document.getElementById('profil87').style.display);

        if (iframe.document.getElementById('profil121')) iframeData.elements.push(iframe.document.getElementById('profil121').innerText);
    }

    if (iframeData.pathname.toLowerCase() === '/meet') {
        if (iframe.document.getElementById('meetSearch')) iframeData.elements.push(iframe.document.getElementById('meetSearch').value);
    }

    if (iframeData.pathname.toLowerCase() === '/news') {
        if (iframe.document.getElementById('search1')) iframeData.elements.push(iframe.document.getElementById('search1').style.display);

        if (iframe.document.getElementById('search3')) iframeData.elements.push(iframe.document.getElementById('search3').value);
    }

    if (iframeData.pathname.toLowerCase() === '/community/fansites') {
        if (iframe.document.getElementById('f37')) iframeData.elements.push(iframe.document.getElementById('f37').style.display);

        if (iframe.document.querySelector('.sfdnom')) iframeData.elements.push(iframe.document.querySelector('.sfdnom').value);
    }

    /*if (iframeData.pathname.toLowerCase() === '/community/fansites/new') {
        if (iframe.document.getElementById('arttitre')) iframeData.elements.push(iframe.document.getElementById('arttitre').value);
    }*/

    if (iframeData.pathname.toLowerCase() === '/forum') {
        if (iframe.document.getElementById('search1')) iframeData.elements.push(iframe.document.getElementById('search1').style.display);

        if (iframe.document.getElementById('search3')) iframeData.elements.push(iframe.document.getElementById('search3').value);
    }

    if (iframeData.pathname.toLowerCase() === '/forum/new-sujet') {
        if (iframe.document.getElementById('topictitl')) iframeData.elements.push(iframe.document.getElementById('topictitl').value);

        if (iframe.document.getElementById('topiccategory')) iframeData.elements.push(iframe.document.getElementById('topiccategory').value);
    }

    if (iframeData.pathname.toLowerCase() === '/boutique/coffres') {
        if (iframe.document.getElementById('boutiqueload')) iframeData.elements.push(iframe.document.getElementById('boutiqueload').style.display);

        if (iframe.document.getElementById('b168')) iframeData.elements.push('b168');
    }

    if (iframeData.pathname.toLowerCase() === '/settings') {
        if (iframe.document.getElementById('settings16')) iframeData.elements.push(iframe.document.getElementById('settings16').style.display);

        if (iframe.document.getElementById('settings38')) iframeData.elements.push(iframe.document.getElementById('settings38').innerText);

        if (iframe.document.getElementById('settings20')) iframeData.elements.push(iframe.document.getElementById('settings20').innerText);
    }

    if (iframe.document.getElementById('cityclub') && iframe.document.getElementById('cityclub').style.display === 'block') {
        iframeData.cityclub = true;
    }

    if (iframeData.pathname.toLowerCase().startsWith('/boutique')) {
        if (iframe.document.getElementById('boutiqueload')) iframeData.elements.push(iframe.document.getElementById('boutiqueload').style.display);

        ///if (iframe.document.getElementById('b101')) iframeData.elements.push(iframe.document.getElementById('b101').value);

        if (iframe.document.getElementById('b280')) iframeData.elements.push('b280');

        /*if (iframe.document.getElementById('b104x')) iframeData.elements.push('b104x');

        if (iframe.document.getElementById('b104')) iframeData.elements.push('b104');

        if (iframe.document.getElementById('b106')) {
            iframeData.elements.push('b106');
            iframeData.elements.push(iframe.document.getElementById('b106').style.display);

            if (iframe.document.getElementById('b110nom')) iframeData.elements.push(iframe.document.getElementById('b110nom').innerText);

            if (iframe.document.getElementById('b109')) iframeData.elements.push(iframe.document.getElementById('b109').src.replace("https://swf.habbocity.me/c_images/album1584/", ""));
        }

        if (iframe.document.getElementById('b201')) iframeData.elements.push('b201');

        if (iframe.document.getElementById('b208')) iframeData.elements.push('b208');

        if (iframe.document.getElementById('b210')) {
            iframeData.elements.push('b210');
            iframeData.elements.push(iframe.document.getElementById('b210').style.display);

            if (iframe.document.getElementById('b215')) iframeData.elements.push(iframe.document.getElementById('b215').innerText);

            if (iframe.document.getElementById('b219')) iframeData.elements.push(iframe.document.getElementById('b219').value);
        }*/
    }

    if (iframe.document.getElementById('fil1') && iframe.document.getElementById('fil1').style.right === '0px') {
        iframeData.fil = true;
        iframeData.elements.push(iframe.document.getElementById('fil1').style.right);

        if (iframe.document.getElementById('fil36')) {
            iframeData.elements.push('fil36');
            iframeData.elements.push(iframe.document.getElementById('fil36').parentNode.id);
        }

        if (iframe.document.getElementById('fil25')) {
            iframeData.elements.push('fil25');
            iframeData.elements.push(iframe.document.getElementById('fil25').value);
        }
    }

    if (iframe.document.getElementById('rydHSG45s') && iframe.document.getElementById('rydHSG45s').style.display === 'block') {
        iframeData.story = true;
        iframeData.elements.push(iframe.document.getElementById('rydHSG45s').style.display);

        if (iframe.document.getElementById('str4')) iframeData.elements.push(iframe.document.getElementById('str4').innerText);
    }

    if (iframe.document.getElementById('rydHSG45si') && iframe.document.getElementById('rydHSG45si').style.display === 'block') {
        iframeData.photos = true;
        iframeData.elements = [];
        iframeData.elements.push(iframe.document.getElementById('rydHSG45si').style.display);

        if (iframe.document.getElementById('str46')) {
            if (iframe.document.querySelectorAll('#str46')[1].parentElement.style.transform === 'scale(1)') {
                iframeData.elements.push(iframe.document.querySelectorAll('#str46')[1].innerText);
            }
        }
    }

    if (iframe.document.getElementById('Parrainage') && iframe.document.getElementById('Parrainage').style.display === 'block') {
        iframeData.sponso = true;
        iframeData.elements.push(iframe.document.getElementById('Parrainage').style.display);

        if (iframe.document.getElementById('Parrainage-Link')) iframeData.elements.push(iframe.document.getElementById('Parrainage-Link').value);
    }

    if (iframe.document.getElementById('ai1') && iframe.document.getElementById('ai1').style.display === 'block') {
        iframeData.helpcenter = true;
        iframeData.elements.push(iframe.document.getElementById('ai1').style.display);

        if (iframe.document.getElementById('ai5')) iframeData.elements.push(iframe.document.getElementById('ai5').innerText);
    }

    if (updater !== 'none') {
        iframeData.update = true;
    }
}