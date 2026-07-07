/**
 * CSV Parser Utility
 * Handles CSV parsing with UTF-8 BOM support
 */

export const parseCSV = (buffer) => {
  if (!buffer || buffer.length === 0) {
    return [];
  }

  let content = buffer.toString('utf-8');

  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.substring(1);
  }

  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCSVLine(lines[0]).map(h => h.trim());

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const row = {};
    headers.forEach((header, index) => {
      let value = values[index] || '';
      value = value.trim();
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      value = value.replace(/""/g, '"');
      row[header] = value;
    });

    if (Object.values(row).some(v => v && v !== '')) {
      rows.push(row);
    }
  }

  return rows;
};

const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
};

export const validateCSVData = (data) => {
  const errors = [];

  if (!Array.isArray(data) || data.length === 0) {
    return { valid: false, errors: ['Dữ liệu CSV trống'] };
  }

  const requiredColumns = ['DayOfWeek', 'StartTime', 'EndTime', 'ActivityName'];
  const firstRow = data[0];

  const missingColumns = requiredColumns.filter(col => !(col in firstRow));
  if (missingColumns.length > 0) {
    errors.push(`Thiếu cột bắt buộc: ${missingColumns.join(', ')}`);
  }

  const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const validActivityTypes = ['pickup', 'meal', 'study', 'nap', 'play', 'dropoff', 'other'];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNum = i + 2;

    if (!validDays.includes(row.DayOfWeek)) {
      errors.push(`Dòng ${rowNum}: DayOfWeek không hợp lệ (${row.DayOfWeek}). Chấp nhận: ${validDays.join(', ')}`);
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
    if (!timeRegex.test(row.StartTime)) {
      errors.push(`Dòng ${rowNum}: StartTime không đúng định dạng (${row.StartTime}). Định dạng: HH:MM`);
    }
    if (!timeRegex.test(row.EndTime)) {
      errors.push(`Dòng ${rowNum}: EndTime không đúng định dạng (${row.EndTime}). Định dạng: HH:MM`);
    }

    if (!row.ActivityName || row.ActivityName.trim() === '') {
      errors.push(`Dòng ${rowNum}: ActivityName bắt buộc`);
    }

    if (row.ActivityType && !validActivityTypes.includes(row.ActivityType)) {
      errors.push(`Dòng ${rowNum}: ActivityType không hợp lệ (${row.ActivityType}). Chấp nhận: ${validActivityTypes.join(', ')}`);
    }
  }

  const seen = new Set();
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const key = `${row.DayOfWeek}-${row.StartTime}`;
    if (seen.has(key)) {
      errors.push(`Dòng ${i + 2}: Trùng lặp (DayOfWeek, StartTime)`);
    }
    seen.add(key);
  }

  return {
    valid: errors.length === 0,
    errors,
    rowCount: data.length
  };
};

export const generateCSVTemplate = () => {
  const headers = ['DayOfWeek', 'StartTime', 'EndTime', 'ActivityName', 'ActivityType', 'Details', 'Location'];
  const rows = [headers.join(',')];

  const defaultActivities = [
    { day: 'Monday', time: '07:30', end: '08:30', name: 'Đón bé & Thể dục sáng', type: 'pickup', details: 'Tập bài dân vũ', location: 'Sân trường' },
    { day: 'Monday', time: '08:30', end: '09:00', name: 'Ăn sáng', type: 'meal', details: 'Suất ăn sáng theo thực đơn', location: 'Phòng ăn' },
    { day: 'Monday', time: '09:00', end: '10:15', name: 'Học tập', type: 'study', details: 'Hoạt động học tập', location: 'Lớp học' },
    { day: 'Monday', time: '10:15', end: '11:15', name: 'Vui chơi tự do', type: 'play', details: 'Chơi tự do', location: 'Lớp học' },
    { day: 'Monday', time: '11:15', end: '14:00', name: 'Ăn trưa & Ngủ trưa', type: 'nap', details: 'Cơm trưa + giấc ngủ trưa', location: 'Phòng ngủ' },
    { day: 'Monday', time: '14:00', end: '14:30', name: 'Ăn xế', type: 'meal', details: 'Trái cây + sữa', location: 'Phòng ăn' },
    { day: 'Monday', time: '14:30', end: '16:00', name: 'Hoạt động chiều', type: 'study', details: 'Kể chuyện hoặc thủ công', location: 'Lớp học' },
    { day: 'Monday', time: '16:00', end: '17:00', name: 'Trả trẻ', type: 'dropoff', details: 'Chuẩn bị đồ dùng và đợi ba mẹ đón', location: 'Cổng A' },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  for (const day of days) {
    const activities = defaultActivities.filter(a => a.day === 'Monday'); // Use Monday structure as baseline for default rows of each day
    for (const act of activities) {
      const row = [
        day,
        act.time,
        act.end,
        `"${act.name}"`,
        act.type,
        `"${act.details}"`,
        `"${act.location}"`
      ];
      rows.push(row.join(','));
    }
  }

  return rows.join('\n');
};
