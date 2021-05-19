const getText = async (url) => {
  if (!url) return '';
  const markdownTextRes = await fetch(url);
  const markDownText = await markdownTextRes.text();
  return markDownText;
};

export default getText;
