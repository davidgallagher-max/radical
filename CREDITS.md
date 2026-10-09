# Credits

Radical's character data is built from **Make Me a Hanzi** by Shaunak Kishore:
https://github.com/skishore/makemeahanzi

- Stroke drawings (`graphics.txt`) are derived from the Arphic PL KaitiM GB and Arphic PL UKai fonts by Arphic Technology Co., Ltd., under the Arphic Public License (`licenses/ARPHIC-PUBLIC-LICENSE.txt`).
- Character meanings, readings, and component data (`dictionary.txt`) are derived from Unihan and CJKlib, under the GNU Lesser General Public License v3 (`licenses/LGPL-3.0.txt`).

## Changes made to the data

`scripts/build_data.py` reformats both files into per-character JSON shards, labels each stroke as a meaning, sound, or idea part based on the source's own etymology data, adds a rating of how closely each sound part matches the character's pronunciation, and applies a small set of documented corrections (listed in `OVERRIDES` in that script). The original files are unchanged.

Traditional and Simplified conversion uses **OpenCC** via opencc-js: https://github.com/nk2028/opencc-js
