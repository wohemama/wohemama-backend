export function uniqueId() {
    const a = Math.random,
      b = parseInt;
    return (
      Number(new Date()).toString() + b(10 * a()) + b(10 * a()) + b(10 * a())
    );
  }