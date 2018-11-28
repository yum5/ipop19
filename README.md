# HOLST Demo
HOLST Demoには、VLAN回線設定、PLZT Optical Slot Size、消費電力削減効果を視覚的に表示できるGUIが含まれています。

## 動作要件
- Node.js 8.11.x 以降がインストールされている
- yarn がインストールされている
- git がインストールされている
- Electronが動作する
- SNMPやscpで情報を取得してくるスイッチやホストと同一ネットワークに接続されている

macOS、Ubuntu 16.04LTSでの動作を確認していますが、他の \*NIX 環境でも動作するはずです。


## インストール
```
git clone git@gitlab.yamanaka.ics.keio.ac.jp:kyosuke/holst-gui.git
cd holst-gui
yarn install
```

## 実行
```
yarn start
```

## パッケージング
Node.js がインストールされていない環境で動作するためには、Electronランタイムのパッケージングが必要です。

```
yarn run pack:linux
# もしくは
# yarn run pack:mac
```

## test

```
yarn test
```

## lint

```
yarn run lint
```

## VLAN回線設定の図の作成
Graphvizでdot言語で作成したグラフをsvgとして出力したものをベースで用いています。

```
dot -Tsvg network.dot -o network.svg
# Inkspace で network.svg を編集する
# [Extension] -> 画像を埋め込む
# copy to src/renderer/resources
```

## SNMPについて
スイッチの受信・送信パケット数はSNMPで取得しています。
https://qiita.com/Mabuchin/items/d435c0afb4f0ca17ad25

### 機器のホスト名

```
$ snmpwalk -v 2c -c public 192.168.100.14 1.3.6.1.2.1.1.5.0
SNMPv2-MIB::sysName.0 = STRING: HOLST M4300TOR#1
$ snmpwalk -v 2c -c public 192.168.100.15 1.3.6.1.2.1.1.5.0
SNMPv2-MIB::sysName.0 = STRING: HOLST M4300TOR#2
```

### 機器にあるインターフェイスの一覧

```
$ snmpwalk -v 2c -c public 192.168.100.14 1.3.6.1.2.1.2.2.1.1
IF-MIB::ifIndex.1 = INTEGER: 1
IF-MIB::ifIndex.2 = INTEGER: 2
IF-MIB::ifIndex.3 = INTEGER: 3
...
...
...
IF-MIB::ifIndex.544 = INTEGER: 544
IF-MIB::ifIndex.545 = INTEGER: 545
IF-MIB::ifIndex.546 = INTEGER: 546
```

### インターフェイスで受信したパケットの総バイト数


```
$ snmpwalk -v 2c -c public 192.168.100.14 1.3.6.1.2.1.31.1.1.1.6.6
IF-MIB::ifHCInOctets.6 = Counter64: 0
```

```
$ snmpwalk -v 2c -c public 192.168.1.1 1.3.6.1.2.1.31.1.1.1.6.1
IF-MIB::ifHCInOctets.1 = Counter64: 2881550
```


### インターフェイス名

```
$ snmpwalk -v 2c -c public 192.168.100.14 1.3.6.1.2.1.2.2.1.2.10
IF-MIB::ifDescr.10 = STRING: Unit: 1 Slot: 0 Port: 10 10G - Level
```

### インターフェイスの論理的な状態

```
$ snmpwalk -v 2c -c public 192.168.100.14 1.3.6.1.2.1.2.2.1.7.10
IF-MIB::ifAdminStatus.10 = INTEGER: up(1)
```

```
$ snmpwalk -v 2c -c public 192.168.1.1 1.3.6.1.2.1.2.2.1.7.3
IF-MIB::ifAdminStatus.3 = INTEGER: down(2)
```
