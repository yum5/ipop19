## SNMP
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
IF-MIB::ifIndex.4 = INTEGER: 4
IF-MIB::ifIndex.5 = INTEGER: 5
IF-MIB::ifIndex.6 = INTEGER: 6
IF-MIB::ifIndex.7 = INTEGER: 7
IF-MIB::ifIndex.8 = INTEGER: 8
IF-MIB::ifIndex.9 = INTEGER: 9
IF-MIB::ifIndex.10 = INTEGER: 10
IF-MIB::ifIndex.11 = INTEGER: 11
IF-MIB::ifIndex.12 = INTEGER: 12
IF-MIB::ifIndex.13 = INTEGER: 13
IF-MIB::ifIndex.14 = INTEGER: 14
IF-MIB::ifIndex.15 = INTEGER: 15
IF-MIB::ifIndex.16 = INTEGER: 16
IF-MIB::ifIndex.17 = INTEGER: 17
IF-MIB::ifIndex.18 = INTEGER: 18
IF-MIB::ifIndex.19 = INTEGER: 19
IF-MIB::ifIndex.20 = INTEGER: 20
IF-MIB::ifIndex.21 = INTEGER: 21
IF-MIB::ifIndex.22 = INTEGER: 22
IF-MIB::ifIndex.23 = INTEGER: 23
IF-MIB::ifIndex.24 = INTEGER: 24
IF-MIB::ifIndex.417 = INTEGER: 417
IF-MIB::ifIndex.418 = INTEGER: 418
IF-MIB::ifIndex.419 = INTEGER: 419
IF-MIB::ifIndex.420 = INTEGER: 420
IF-MIB::ifIndex.421 = INTEGER: 421
IF-MIB::ifIndex.422 = INTEGER: 422
IF-MIB::ifIndex.423 = INTEGER: 423
IF-MIB::ifIndex.424 = INTEGER: 424
IF-MIB::ifIndex.425 = INTEGER: 425
IF-MIB::ifIndex.426 = INTEGER: 426
IF-MIB::ifIndex.427 = INTEGER: 427
IF-MIB::ifIndex.428 = INTEGER: 428
IF-MIB::ifIndex.429 = INTEGER: 429
IF-MIB::ifIndex.430 = INTEGER: 430
IF-MIB::ifIndex.431 = INTEGER: 431
IF-MIB::ifIndex.432 = INTEGER: 432
IF-MIB::ifIndex.433 = INTEGER: 433
IF-MIB::ifIndex.434 = INTEGER: 434
IF-MIB::ifIndex.435 = INTEGER: 435
IF-MIB::ifIndex.436 = INTEGER: 436
IF-MIB::ifIndex.437 = INTEGER: 437
IF-MIB::ifIndex.438 = INTEGER: 438
IF-MIB::ifIndex.439 = INTEGER: 439
IF-MIB::ifIndex.440 = INTEGER: 440
IF-MIB::ifIndex.441 = INTEGER: 441
IF-MIB::ifIndex.442 = INTEGER: 442
IF-MIB::ifIndex.443 = INTEGER: 443
IF-MIB::ifIndex.444 = INTEGER: 444
IF-MIB::ifIndex.445 = INTEGER: 445
IF-MIB::ifIndex.446 = INTEGER: 446
IF-MIB::ifIndex.447 = INTEGER: 447
IF-MIB::ifIndex.448 = INTEGER: 448
IF-MIB::ifIndex.449 = INTEGER: 449
IF-MIB::ifIndex.450 = INTEGER: 450
IF-MIB::ifIndex.451 = INTEGER: 451
IF-MIB::ifIndex.452 = INTEGER: 452
IF-MIB::ifIndex.453 = INTEGER: 453
IF-MIB::ifIndex.454 = INTEGER: 454
IF-MIB::ifIndex.455 = INTEGER: 455
IF-MIB::ifIndex.456 = INTEGER: 456
IF-MIB::ifIndex.457 = INTEGER: 457
IF-MIB::ifIndex.458 = INTEGER: 458
IF-MIB::ifIndex.459 = INTEGER: 459
IF-MIB::ifIndex.460 = INTEGER: 460
IF-MIB::ifIndex.461 = INTEGER: 461
IF-MIB::ifIndex.462 = INTEGER: 462
IF-MIB::ifIndex.463 = INTEGER: 463
IF-MIB::ifIndex.464 = INTEGER: 464
IF-MIB::ifIndex.465 = INTEGER: 465
IF-MIB::ifIndex.466 = INTEGER: 466
IF-MIB::ifIndex.467 = INTEGER: 467
IF-MIB::ifIndex.468 = INTEGER: 468
IF-MIB::ifIndex.469 = INTEGER: 469
IF-MIB::ifIndex.470 = INTEGER: 470
IF-MIB::ifIndex.471 = INTEGER: 471
IF-MIB::ifIndex.472 = INTEGER: 472
IF-MIB::ifIndex.473 = INTEGER: 473
IF-MIB::ifIndex.474 = INTEGER: 474
IF-MIB::ifIndex.475 = INTEGER: 475
IF-MIB::ifIndex.476 = INTEGER: 476
IF-MIB::ifIndex.477 = INTEGER: 477
IF-MIB::ifIndex.478 = INTEGER: 478
IF-MIB::ifIndex.479 = INTEGER: 479
IF-MIB::ifIndex.480 = INTEGER: 480
IF-MIB::ifIndex.481 = INTEGER: 481
IF-MIB::ifIndex.482 = INTEGER: 482
IF-MIB::ifIndex.483 = INTEGER: 483
IF-MIB::ifIndex.484 = INTEGER: 484
IF-MIB::ifIndex.485 = INTEGER: 485
IF-MIB::ifIndex.486 = INTEGER: 486
IF-MIB::ifIndex.487 = INTEGER: 487
IF-MIB::ifIndex.488 = INTEGER: 488
IF-MIB::ifIndex.489 = INTEGER: 489
IF-MIB::ifIndex.490 = INTEGER: 490
IF-MIB::ifIndex.491 = INTEGER: 491
IF-MIB::ifIndex.492 = INTEGER: 492
IF-MIB::ifIndex.493 = INTEGER: 493
IF-MIB::ifIndex.494 = INTEGER: 494
IF-MIB::ifIndex.495 = INTEGER: 495
IF-MIB::ifIndex.496 = INTEGER: 496
IF-MIB::ifIndex.497 = INTEGER: 497
IF-MIB::ifIndex.498 = INTEGER: 498
IF-MIB::ifIndex.499 = INTEGER: 499
IF-MIB::ifIndex.500 = INTEGER: 500
IF-MIB::ifIndex.501 = INTEGER: 501
IF-MIB::ifIndex.502 = INTEGER: 502
IF-MIB::ifIndex.503 = INTEGER: 503
IF-MIB::ifIndex.504 = INTEGER: 504
IF-MIB::ifIndex.505 = INTEGER: 505
IF-MIB::ifIndex.506 = INTEGER: 506
IF-MIB::ifIndex.507 = INTEGER: 507
IF-MIB::ifIndex.508 = INTEGER: 508
IF-MIB::ifIndex.509 = INTEGER: 509
IF-MIB::ifIndex.510 = INTEGER: 510
IF-MIB::ifIndex.511 = INTEGER: 511
IF-MIB::ifIndex.512 = INTEGER: 512
IF-MIB::ifIndex.513 = INTEGER: 513
IF-MIB::ifIndex.514 = INTEGER: 514
IF-MIB::ifIndex.515 = INTEGER: 515
IF-MIB::ifIndex.516 = INTEGER: 516
IF-MIB::ifIndex.517 = INTEGER: 517
IF-MIB::ifIndex.518 = INTEGER: 518
IF-MIB::ifIndex.519 = INTEGER: 519
IF-MIB::ifIndex.520 = INTEGER: 520
IF-MIB::ifIndex.521 = INTEGER: 521
IF-MIB::ifIndex.522 = INTEGER: 522
IF-MIB::ifIndex.523 = INTEGER: 523
IF-MIB::ifIndex.524 = INTEGER: 524
IF-MIB::ifIndex.525 = INTEGER: 525
IF-MIB::ifIndex.526 = INTEGER: 526
IF-MIB::ifIndex.527 = INTEGER: 527
IF-MIB::ifIndex.528 = INTEGER: 528
IF-MIB::ifIndex.529 = INTEGER: 529
IF-MIB::ifIndex.530 = INTEGER: 530
IF-MIB::ifIndex.531 = INTEGER: 531
IF-MIB::ifIndex.532 = INTEGER: 532
IF-MIB::ifIndex.533 = INTEGER: 533
IF-MIB::ifIndex.534 = INTEGER: 534
IF-MIB::ifIndex.535 = INTEGER: 535
IF-MIB::ifIndex.536 = INTEGER: 536
IF-MIB::ifIndex.537 = INTEGER: 537
IF-MIB::ifIndex.538 = INTEGER: 538
IF-MIB::ifIndex.539 = INTEGER: 539
IF-MIB::ifIndex.540 = INTEGER: 540
IF-MIB::ifIndex.541 = INTEGER: 541
IF-MIB::ifIndex.542 = INTEGER: 542
IF-MIB::ifIndex.543 = INTEGER: 543
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


## TODO
Makefile

```
dot -Tsvg network.dot -o network.svg
# Modify network.svg in Inkspace
# Click [Extension] -> Embed Image @inkspace
# copy to src/renderer/resources
```
