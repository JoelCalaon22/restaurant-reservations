const makeTables = (branchId, config) => {
  const out = [];
  let n = 1;

  for (const { seats, count } of config) {
    for (let i = 0; i < count; i++) {
      out.push({ id: `${branchId}-t${n}`, branchId, seats });
      n++;
    }
  }

  return out;
};

export const tables = [
  ...makeTables("ros-1", [{ seats: 2, count: 4 }, { seats: 4, count: 6 }, { seats: 8, count: 1 }]),
  ...makeTables("ros-2", [{ seats: 2, count: 3 }, { seats: 4, count: 4 }, { seats: 6, count: 2 }]),
  ...makeTables("ros-3", [{ seats: 2, count: 2 }, { seats: 4, count: 3 }, { seats: 6, count: 1 }]),
  ...makeTables("caba-1", [{ seats: 2, count: 6 }, { seats: 4, count: 8 }, { seats: 8, count: 3 }]),
  ...makeTables("caba-2", [{ seats: 2, count: 8 }, { seats: 4, count: 10 }, { seats: 6, count: 4 }, { seats: 8, count: 2 }]),
  ...makeTables("caba-3", [{ seats: 2, count: 4 }, { seats: 4, count: 6 }, { seats: 6, count: 2 }]),
  ...makeTables("cor-1", [{ seats: 2, count: 3 }, { seats: 4, count: 5 }, { seats: 6, count: 2 }]),
  ...makeTables("cor-2", [{ seats: 2, count: 2 }, { seats: 4, count: 2 }]),
];