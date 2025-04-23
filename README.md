## zustand用法
```
npm i zustand
```
建立仓库
```
import { create } from 'zustand';

const useCounterStore = create((set, get) => {
  return {
    count: 0,

    increase: function () {
      const state = get();
      set({ count: state.count + 1 });
    },

    decrease: function () {
      const state = get();
      set({ count: state.count - 1 });
    },

    reset: function () {
      set({ count: 0 });
    },
  };
});

export default useCounterStore;
```
或
```
import { create } from 'zustand';

const useCounterStore = create((set) => ({
  count: 0,

  increase: () =>
    set((state) => ({
      count: state.count + 1,
    })),

  decrease: () =>
    set((state) => ({
      count: state.count - 1,
    })),

  reset: () =>
    set(() => ({
      count: 0,
    })),
}));

export default useCounterStore;
```
使用仓库
```
import useCounterStore from './useCounterStore';
function Counter() {
  const { count, increase, decrease, reset } = useCounterStore();
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increase}>Increase</button>
      <button onClick={decrease}>Decrease</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```
或
```
import useCounterStore from './useCounterStore';
function Counter() {
  const { count, increase, decrease, reset } = useCounterStore((state) => ({
    count: state.count,
    increase: state.increase,
    decrease: state.decrease,
    reset: state.reset,
  }));
  return (
    <div> 
      <h1>Count: {count}</h1>
      <button onClick={increase}>Increase</button>
      <button onClick={decrease}>Decrease</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}