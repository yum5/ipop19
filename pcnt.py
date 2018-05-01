import sys
import subprocess
import signal
import time
import datetime
import re
import csv

COMMAND = "./fakenetstat"

def res_cmd_read(cmd):
    return subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE).communicate()


def packetCount(arg1, arg2):
    global perf_counter_old
    global rx_old
    global tx_old
    result = res_cmd_read([COMMAND, "-I%s" % argvs[1]])
    stdout_decoded = result[0].decode(encoding='utf-8')
    cnt_data = re.split(" +", stdout_decoded.split('\n')[2])

    # カウンタ処理
    perf_counter = time.perf_counter()
    time_interval = perf_counter - perf_counter_old
    perf_counter_old = perf_counter
    rx_now = int(cnt_data[3])
    tx_now = int(cnt_data[7])
    rx_per_1s = round((rx_now - rx_old) / time_interval)
    tx_per_1s = round((tx_now - tx_old) / time_interval)
    now = datetime.datetime.now()

    if rx_old != 0 and tx_old != 0:
        print("%s %d %d %f" % ('{0:%Y-%m-%d %H:%M:%S}'.format(now), rx_per_1s, tx_per_1s, perf_counter))

        try:
            f = open(filename, 'a')
            writer = csv.writer(f, lineterminator='\n')
            csvlist = []
            csvlist.append('{0:%Y-%m-%d %H:%M:%S}'.format(now))  # 現在時刻
            csvlist.append(str(rx_per_1s))  # 1秒のRX増分
            csvlist.append(str(tx_per_1s))  # 1秒のTX増分
            csvlist.append(str(perf_counter))  # パフォーマンスカウンタ値
            csvlist.append(str(rx_now))  # RXカウンタ値
            csvlist.append(str(tx_now))  # TXカウンタ値
            writer.writerow(csvlist)
            f.close()
        except IOError:
            sys.stderr.write("IOError!")

    rx_old = rx_now
    tx_old = tx_now

    return


def sigint_handler(arg1, arg2):
    global sigint
    sigint = True


# プログラム開始
argvs = sys.argv
argc = len(argvs)

if argc < 2:
    print("Usage: # pcnt interface-name filename(option)")
    exit(1)

filename = 'output.csv'
if argc > 2:
    filename = argvs[2]

# インターフェース存在確認
result = res_cmd_read([COMMAND, "-I%s" % argvs[1]])
if result[1].decode(encoding='utf-8') != '':
    print("The interface name is invalid.")
    exit(1)

perf_counter_old = time.perf_counter()
rx_old = 0
tx_old = 0

sigint = False

# タイマー動作開始
signal.signal(signal.SIGALRM, packetCount)
signal.signal(signal.SIGINT, sigint_handler)
signal.setitimer(signal.ITIMER_REAL, 1, 1)

while True:
    time.sleep(1)
    if sigint:
        print("SIGINT recv")
        break

exit(0)
