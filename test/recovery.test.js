'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('standalone page is unbranded and documents the exact five-wire map', () => {
  const html = read('site/index.html');
  assert.doesNotMatch(html, /FlightCore/i);
  assert.match(html, /Nano A5 \/ SCL[\s\S]*1 — SCL/);
  assert.match(html, /Nano GND[\s\S]*2 — GND/);
  assert.match(html, /9 V red \/ \+[\s\S]*4 — PACK\+/);
  assert.match(html, /9 V black \/ −[\s\S]*5 — GND/);
  assert.match(html, /Nano A4 \/ SDA[\s\S]*6 — SDA/);
  assert.match(read('site/assets/spark-connector.svg'), /HOLD THE BATTERY THIS WAY/);
  assert.match(read('site/assets/spark-wiring.svg'), /CONNECT THESE FIVE WIRES/);
  assert.match(read('site/assets/spark-wiring.svg'), /NO WIRE/);
});

test('V9 engine accepts severely discharged but nonzero cells and keeps BMS guards', () => {
  const engine = read('site/helper/recovery-engine.command');
  assert.match(engine, /Recovery V9/);
  assert.match(engine, /pack_mv < 5400/);
  assert.match(engine, /min\(cells\) < 1800/);
  assert.match(engine, /cell_spread > 300/);
  assert.match(engine, /safety_before & 1/);
  assert.match(engine, /command\("WW 00 0029"\)/);
  assert.match(engine, /command\("WW 00 0030"\)/);
  assert.match(engine, /BUSRESET/);
  assert.match(engine, /for attempt in range\(5\)/);
  assert.match(engine, /OperationStatus immediately before PF reset/);
  assert.match(engine, /Reset authorization : Full Access immediately before PF reset/);
  assert.ok(engine.indexOf('PFStatus immediately after reset') < engine.indexOf('SafetyStatus after reset'));
});

test('helper reuses the open page through an origin-restricted loopback bootstrap', () => {
  const helper = read('site/helper/DJI-Spark-Recovery-Mac.command');
  const app = read('site/app.js');
  assert.match(helper, /ThreadingHTTPServer\(\("127\.0\.0\.1", port\)/);
  assert.match(helper, /route == "\/bootstrap"/);
  assert.match(helper, /Origin[\s\S]*https:\/\/johbaa\.github\.io/);
  assert.doesNotMatch(helper, /open "\$PAGE"/);
  assert.match(app, /fetch\(`\$\{endpoint\}\/bootstrap`/);
  assert.match(app, /confirmation\.checked/);
});

test('complete recovery output can be exported as a timestamped text log', () => {
  const html = read('site/index.html');
  const app = read('site/app.js');
  const helper = read('site/helper/DJI-Spark-Recovery-Mac.command');
  assert.match(html, /id="exportLogButton"[\s\S]*Export complete output log/);
  assert.match(app, /new Blob\(\[completeLog\]/);
  assert.match(app, /DJI_Spark_Recovery_\$\{stamp\}\.txt/);
  assert.doesNotMatch(helper, /250_000/);
});
