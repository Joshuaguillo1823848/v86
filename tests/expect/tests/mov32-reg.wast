(module
  (type $t0 (func))
  (type $t1 (func (param i32)))
  (type $t2 (func (param i32 i32)))
  (type $t3 (func (param i32 i32 i32)))
  (type $t4 (func (result i32)))
  (type $t5 (func (param i32) (result i32)))
  (type $t6 (func (param i32 i32) (result i32)))
  (import "e" "get_seg" (func $e.get_seg (type $t5)))
  (import "e" "instr32_B8" (func $e.instr32_B8 (type $t1)))
  (import "e" "instr32_B9" (func $e.instr32_B9 (type $t1)))
  (import "e" "instr32_BA" (func $e.instr32_BA (type $t1)))
  (import "e" "instr32_BB" (func $e.instr32_BB (type $t1)))
  (import "e" "instr_F4" (func $e.instr_F4 (type $t0)))
  (import "e" "m" (memory $e.m 256))
  (func $f (export "f") (type $t1) (param $p0 i32)
    (local $l0 i32)
    (set_local $p0
      (get_local $p0))
    (loop $L0
      (block $B1
        (block $B2
          (br_table $B2 $B1
            (get_local $p0)))
        (call $e.instr32_B8
          (i32.const -889270259))
        (call $e.instr32_B9
          (i32.const -1091583778))
        (call $e.instr32_BA
          (i32.const 0))
        (call $e.instr32_BB
          (i32.const 0))
        (i32.store
          (i32.const 8)
          (i32.load
            (i32.const 28)))
        (i32.store
          (i32.const 12)
          (i32.load
            (i32.const 32)))
        (i32.store
          (i32.const 12)
          (i32.load
            (i32.const 4)))
        (i32.store
          (i32.const 4)
          (i32.load
            (i32.const 8)))
        (i32.store
          (i32.const 560)
          (i32.add
            (i32.load
              (i32.const 556))
            (i32.const 28)))
        (i32.store
          (i32.const 556)
          (i32.add
            (i32.load
              (i32.const 556))
            (i32.const 29)))
        (i32.store
          (i32.const 664)
          (i32.add
            (i32.load
              (i32.const 664))
            (i32.const 9)))
        (call $e.instr_F4)
        (return))
      (unreachable))))
