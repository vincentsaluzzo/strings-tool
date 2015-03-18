XLSX
====

Simple XLSX writer.

# Installation

```
npm install node-simple-xlsx
```

# Usage

```javascript
var xls = require('node-simple-xlsx'),
    data = [
        {
            'Name': 'Bob',
            'Location': 'Sweden'
        },
        {
            'Name': 'Alice',
            'Location': 'France'
        }
    ];

xls.write('test.xlsx', data, function (err) {
    if (err) {
        console.log('Error: ', err);
    } else {
        console.log('Done.');
    }
});
```

# Advanced usage

```javascript
var XlsxWriter = require('node-simple-xlsx'),
    writer = new XlsxWriter();

writer.setHeaders(['Name', 'Location']);

writer.addRow({
    'user_name': 'Bob',
    'loc': 'Sweden'
});
writer.addRow({
    'user_name': 'Alice',
    'loc': 'France'
});
writer.addRow({
    'user_name': 'Bob',
    'loc': 'France'
});
writer.addRow({
    'user_name': 'Bob',
    'loc': 'France'
});

writer.pack('test.xlsx', function (err) {
    if (err) {
        console.log('Error: ', err);
    } else {
        console.log('Done.');
    }
});
```

# License

This library is released under the MIT license. See the bundled LICENSE file
for details.
