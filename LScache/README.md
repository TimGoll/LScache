# LScache
LScache ist eine Blibliothek, die es dem Entwickler einfacher macht, den ```localStorage``` zu verwenden. Dabei übernimmt die Bibilothek die gesamte Verwaltung der Daten und fügt auch ein Abalufdatum gespeicherter Daten hinzu und ermöglicht es Bilder in diesem Speicher zu cashen. Besonders wenn man Bilder zwischenspeichern möchte, ist der Speicher von etwa 5MB sehr schnell belegt. Aus diesem Grund wurde bei der Entwicklung der Bibilothek Datenkomprimierung mit eingeplant und es empfiehlt sich diese Bibliothek zusammen mit [lz-String](https://github.com/pieroxy/lz-string) zu verwenden.

## Eckdaten
- basiert auf ```localStorage```
- standardmäßig bis zu 5MB Speicher
- Browserkompatibilität: Chrome 4+, Firefox 3.5+, InternetExplorer 8+, Opera 10.50+, Safari 4+
- speichert lokal auf dem Computer, Daten sind über alle geöffneten Tabs der selben Domain verfügbar
- Events abfangbar, wenn in einem anderen Tab die Daten verändert werden
- Daten bleiben erhalten, bis Cookies gelöscht werden, diese Bibliothek unterstützt aber eine zeitgesteuerte Datengültigkeit

## Einbinden
Nach dem Download der aktuellsten Version (es empfiehlt sich die min-Version zu laden), muss die Datei auf den eigenen Webserver gespeichert werden und anschließend im Header der HTML Datei eingebunden werden. Hierbei muss die Bibliothek vor allen Dateien, die auf diese zurückgreifen, eingebunden werden.

```html
<script type="text/javascript" src="your/path/LScache.min.js"></script>
```

Falls die Komprimierungsfunktion der Bibliothek aktiviert werden soll, muss außerdem [lz-String](https://github.com/pieroxy/lz-string) installiert sein und vorher eingebunden werden.

```html
<script type="text/javascript" src="your/path/lz-string.min.js"></script>
<script type="text/javascript" src="your/path/LScache.min.js"></script>
```

## Befehle
### Initialisierung
```js
LScache.init({[compression_type]});
//compression_type : DISABLE, DEFAULT, COMPATIBILITY [default: DISABLE]
```
Der Parameter der ```init()``` Funktion ist optional und sollte gesetzt werden, wenn der Cash für Bilder verwendet werden soll. Die init() Funktion sollte auf jeden Fall beim Laden der Seite ausgeführt werden, da sonst zum Beispiel Eventlistener nicht funktionieren.

**Compression Type:**<br>
```DISABLE```, ```DEFAULT``` und ```COMPATIBILITY``` stehen zur Verfügung. Standardmäßig ist die Komprimierung deaktiviert, da dafür die LZ-string Bibliothek gebraucht wird. Die ```DEFAULT```-Komprimierung funktioniert nur in Webkit Browsern (Android Browser, Chrome, Safari, Opera), daher gibt es die ```COMPATIBILITY```-Komprimierung für die restlichen Browser (IE9-10, Firefox, Edge). Dieser Modus braucht jedoch 166% des ```DEFAULT```-Speichers.

**Beispiel:**
```js
window.onload = function() {
    LScache.init({compression_type: DEFAULT});
};
```

### Element hinzufügen
```js
LScache.add(objectname, object, {[expiretime]});
```

**Beispiel:**
```js
var my_object = {
    key_1 : "beliebiger Eintrag",
    key_2 : [1, 5, 8],
    key_3 : {
        a: 19,
        b: 5
    }
};

var my_string = "Hallo Welt!";

LScache.add('my_object', my_object); // >>> true
LScache.add('my_object', my_string); // >>> false
LScache.add('my_string', my_string); // >>> true
```

### Element aktualisieren
```js
LScache.update(objectname, object, {[expiretime]});
```

**Beispiel:**
```js
var my_string = "Hallo schöne Welt!";

LScache.add('my_random_key', my_string); // >>> false
LScache.add('my_string', my_string);     // >>> true
```

### Element bekommen
```js
LScache.get(objectname);
```

**Beispiel:**
```js
var my_string = "Hallo schöne Welt!";

LScache.get('my_random_key');    // >>> false
LScache.get('my_string')         // >>> "Hallo schöne Welt!"
```

### Element löschen
```js
LScache.remove(objectname);
```

### alle Elemente löschen
```js
LScache.remove_all();
```

### Bild von Server Laden und in Speicher schreiben
Hier ist zu beachten, dass diese Funktion kein ```false``` zurück gibt, wenn der Name bereits vergeben wird. Überschrieben werden Daten dennoch nicht.
```js
LScache.convert_to_base64_from_path(objectname, filepath, callback, {[expiretime]});
```

**Beispiel:**
```js
//Neues Bild in Cash speichern
LScache.convert_to_base64_from_path('testimage', 'test.jpg', LScache.add);
//Bild in Cash aktualisieren
LScache.convert_to_base64_from_path('testimage', 'test.jpg', LScache.update);
```

### Bild aus Cash einbinden
Diese Funktion wird nur gebraucht, wenn Bildkompression aktiviert ist.
```js
LScache.uncompress_image(objectname);
```

HTML:
```html
<body>
    <img id="my_image">
</body>
```

JS:
```js
var image_data = LScache.uncompress_image(LScache.get('testimage'));
if (image_data != false)
    document.getElementById('my_image').src = image_data;
```

### EventListener hinzufügen
Es ist möglich vier verschiedene Callbackfunktionen zu registrieren. Folgende vier Events stehen zur Verfügung: ```added```, ```changed```, ```removed``` und ```expired```. ```expired``` steht in allen geöffneten Tabs zur Verfügung, auch in dem Aktiven. Die anderen drei Events werden nur in den Tabs ausgeführt, die nicht das Event auslösen.
```js
LScache.addEventListener(type, function_pointer);
```

**Beispiel:**
```js
var my_callbackFunction = function(event) {
    console.log(event.key);
    console.log(event.obj);
};

LScache.addEventListener('added', my_callbackFunction); // >>> true
```

### EventListener entfernen
```js
LScache.removeEventListener(type);
```

**Beispiel:**
```js
LScache.removeEventListener('added');
```

### Zeit bis zur Ungültigkeit aktualisieren
```js
LScache.update_expiretime(objectname, {expiretime});
```

### Zeit bis zur Ungültigkeit abfragen
```js
LScache.get_expiretime(objectname);
```

### Größe des belegten Speichers bestimmen
```js
LScache.get_size();
```

### Liste aller Elemente im Speicher auslesen
```js
LScache.get_stored_list();
```

## Performance
### Datenkompression anhand eines Beispiels
Dieses Bild hat auf der Festplatte eine Größe von ```676.260 Bytes```. Standardmäßig (unkompremiert) werden ```901.703 Bytes``` verwendet. Die ```DEFAULT```-Komprimierung erzielt eine Größe von ```396.865 Bytes```, die ```COMPATIBILITY```-Komprimierung jedoch ```658.796 Bytes```.

![Beispielbild](https://github.com/TimDerGoll/webstuff/blob/master/LScache/tests/test.jpg "Beispielbild")
