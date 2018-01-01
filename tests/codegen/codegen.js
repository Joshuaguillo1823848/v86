#!/usr/bin/env node
"use strict";

const fs = require("fs");

global.v86util = {};
require("../../src/browser/lib.js");

const Codegen = require("../../src/codegen.js");

const codegen_module_buffer = fs.readFileSync(__dirname + "/../../build/codegen-test.wasm");

const vals = {
    imm8: 1,
    imm8s: 1,
    imm16: 2,
    imm32s: 3,
    asize_32: false,
    reg16: 0,
    reg32s: 0,
    instruction_pointer: 0,
    previous_ip: 0,
};

v86util.load_wasm("build/codegen-test.wasm", {
    env: {
        _read_imm8() { return vals.imm8; },
        _read_imm8s() { return vals.imm8s; },
        _read_imm16() { return vals.imm16; },
        _read_imm32s() { return vals.imm32s; },
        _is_asize_32() { return vals.asize_32; },
        _printf(...args) { console.log(...args); },

        // static pointer imports
        g$_reg16() { return vals.reg16; },
        g$_reg32s() { return vals.reg32s; },
        g$_instruction_pointer() { return vals.instruction_pointer; },
        g$_previous_ip() { return vals.previous_ip; },
    }
}, function(wm) {
    try {
        test(new Codegen(wm));
    } catch(er) {
        console.error(er);
        process.exit(1);
    }
});

function test(gen)
{
    gen.reset();
    gen.fn0("fn0");
    gen.fn1("fn1", 0);
    gen.fn2("fn2", 0, 1);
    gen.increment_instruction_pointer(10);
    gen.set_previous_eip();
    gen.modrm_fn0("fn1r");
    gen.drop();
    gen.modrm_fn1("fn2r", 2);
    gen.drop();
    vals.asize_32 = !vals.asize_32;
    gen.modrm_fn0("fn1r");
    gen.drop();
    gen.modrm_fn1("fn2r", 2);
    gen.drop();
    gen.finish();

    let buf = gen.get_module_code();
    fs.writeFileSync(__dirname + "/../../build/codegen-test-output.wasm", buf);

    const module = new WebAssembly.Module(buf);

    const expected = [
        ["fn0"],
        ["fn1", 0],
        ["fn2", 0, 1],
        ["fn1r", 0],
        ["fn2r", 0, 0],
        ["fn1r", 0],
        ["fn2r", 0, 0],
    ];

    const store = [];

    const imports = {
        e: {
            fn0() { store.push(["fn0"]); },
            fn1(arg0) { store.push(["fn1", arg0]); },
            fn2(arg0, arg1) { store.push(["fn2", arg0, arg1]); },
            fn1r(arg0) { store.push(["fn1r", arg0]); },
            fn2r(arg0, arg1) { store.push(["fn2r", arg0, arg1]); },
            get_seg_prefix_ds() {},
            get_seg_prefix_ss() {},
            get_seg_prefix() {},
            m: new WebAssembly.Memory({ initial: 256 * 1024 * 1024 / 64 / 1024 }),
        },
    };
    const o = new WebAssembly.Instance(module, imports);
    o.exports.f();
    const view = new Uint32Array(imports.e.m.buffer);
    console.log(store);
    console.assert(view[vals.instruction_pointer] === 10);
    console.assert(view[vals.previous_ip] === 10);
    console.assert(JSON.stringify(store) === JSON.stringify(expected));
}
