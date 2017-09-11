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
LScash.init({[compression_type], [expiredate], [storagesize]});
//compression_type : DISABLE, DEFAULT, COMPATIBILITY [default: DISABLE]
//expiredate       : DISABLE, ENABLE [default: DISABLE]
//storagesize      : size in Bytes [default: 5.242.880 Bytes]
```
Alle drei Parameter der ```init()``` Funktion sind optional, es ist aber dennoch empfohlen diese beispielsweise in einem ```window.onlaod``` Event auszuführen, um auch gleichzeitig die Daten aus dem Cash (falls vorhanden) zu laden.

#### Compression Type
bla

#### Expiredate
bla

#### Storagesize
bla

Eine empfohlene Implementierung würde wie folgt aussehen:
```js
window.onload = function() {
    LScash.init({compression_type: DEFAULT, expiredate: ENABLE});
};
```

## ajaxHandler

## Popup Generator

## simple Imagebox
