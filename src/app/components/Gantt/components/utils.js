/**
 * Based on the issue type returns a color associated with the issue type.
 *
 * @param {String} issueType The issue's assigned Issue Type
 * @returns {String} The color associated with the issue type.
 */
const getIssueColor = (issueType) => {
  switch (issueType) {
    case 'TASK':
      return '#FFD700';
    case 'BGFX':
      return '#FF0000';
    case 'PROJ':
      return '#00FF00';
    case 'FEAT':
      return '#0000FF';
    default:
      return '#000000';
  }
};

export { getIssueColor };
