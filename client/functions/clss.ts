const clss = (classes?: (string | boolean | null | undefined)[]) => {
  if (!classes) return '';
  let classNames: string[] = [];

  classes.forEach((className) => {
    if (typeof className !== 'string') return;
    if ((className || '').length > 0) {
      classNames.push(className);
    };
  });

  return classNames.join(' ');
};

export default clss;