# WebStuff
Dieses Repository umfasst mehrere verschiedene Bibliotheken, entwickelt für die Nutzung im modernen Web.

## LScash
**aktuell WIP** LScash ist eine Blibliothek, die es dem Entwickler einfacher macht, den ```localStorage``` zu verwenden. Dabei übernimmt die Bibilothek die gesamte Verwaltung der Daten und fügt auch ein Abalufdatum gespeicherter Daten hinzu und ermöglicht es Bilder in diesem Speicher zu cashen. Besonders wenn man Bilder zwischenspeichern möchte, ist der Speicher von etwa 5MB sehr schnell belegt. Aus diesem Grund wurde bei der Entwicklung der Bibilothek Datemkomprimierung mit eingeplant und es empfiehlt sich diese Bibliothek zusammen mit [lz-String](https://github.com/pieroxy/lz-string) zu verwenden.

### Eckdaten
- basiert auf ```localStorage```
- standardmäßig bis zu 5MB Speicher
- Browserkompatibilität: Chrome 4+, Firefox 3.5+, InternetExplorer 8+, Opera 10.50+, Safari 4+
- speichert lokal auf dem Computer, Daten sind über alle geöffneten Tabs der selben Domain verfügbar
- Daten bleiben erhalten, bis Cookies gelöscht werden, diese Bibliothek unterstützt aber eine zeitgesteuerte Datengültigkeit

### Einbinden
Nach dem Download der aktuellsten Version (es empfiehlt sich die min-Version zu laden), muss die Datei auf den eigenen Webserver gespeichert werden und anschließend im Header der HTML Datei eingebunden werden. Hierbei muss die Bibliothek vor allen Dateien, die auf diese zurückgreifen, eingebunden werden.

```html
<script type="text/javascript" src="your/path/LScash.min.js"></script>
```

Falls die Komprimierungsfunktion der Bibliothek aktiviert werden soll, muss außerdem [lz-String](https://github.com/pieroxy/lz-string) installiert sein und vorher eingebunden werden.

```html
<script type="text/javascript" src="your/path/lz-string.min.js"></script>
<script type="text/javascript" src="your/path/LScash.min.js"></script>
```

### Initialisierung
```js
LScash.init({[compression_type]});
//compression_type : DISABLE, DEFAULT, COMPATIBILITY [default: DISABLE]
```
Der Parameter der ```init()``` Funktion ist optional und sollte gesetzt werden, wenn der Cash für Bilder verwendet werden soll. Die init() Funktion sollte auf jeden Fall beim Laden der Seite ausgeführt werden, da sonst zum Beispiel Eventlistener nicht funktionieren.

**Compression Type:**<br>
bla

**Beispiel:**
```js
window.onload = function() {
    LScash.init({compression_type: DEFAULT});
};
```

### Element hinzufügen
```js
LScash.add(objectname, object, {[expiretime]});
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

LScash.add('my_object', my_object); // >>> true
LScash.add('my_object', my_string); // >>> false
LScash.add('my_string', my_string); // >>> true
```

### Element aktualisieren
```js
LScash.update(objectname, object, {[expiretime]});
```

**Beispiel:**
```js
var my_string = "Hallo schöne Welt!";

LScash.add('my_random_key', my_string); // >>> false
LScash.add('my_string', my_string);     // >>> true
```

### Element bekommen
```js
LScash.get(objectname);
```

**Beispiel:**
```js
var my_string = "Hallo schöne Welt!";

LScash.get('my_random_key');    // >>> false
LScash.get('my_string')         // >>> "Hallo schöne Welt!"
```

### Element löschen
```js
LScash.remove(objectname);
```

### alle Elemente löschen
```js
LScash.remove_all(objectname);
```

### EventListener hinzufügen
```js
LScash.addEventListener(type, function_pointer);
```

**Beispiel:**
```js
var my_callbackFunction = function(event) {
    console.log(event.key);
    console.log(event.obj);
};

LScash.addEventListener('added', my_callbackFunction); // >>> true
```

### EventListener entfernen
```js
LScash.removeEventListener(type);
```

**Beispiel:**
```js
LScash.addEventListener('added');
```

### Zeit bis zur Ungültigkeit aktualisieren
```js
LScash.update_expiretime(objectname, {expiretime});
```

### Zeit bis zur Ungültigkeit abfragen
```js
LScash.get_expiretime(objectname);
```

### Größe des belegten Speichers bestimmen
```js
LScash.get_size();
```

### Liste aller Elemente im Speicher auslesen
```js
LScash.get_stored_list();
```


## ajaxHandler
callback Funktionen verwalten

## Popup Generator
resizable, moveable, button area, title area, html fillable main area

## simple Imagebox
wie Lightbox, nur ohne jquery und all dem overhead

## Input Checker
Password, Email, textlength, date
