import * as weeklyScheduleService from '../src/modules/teacher/sub/weeklySchedule.service.js';
import pool from '../src/config/db.js';

async function runTest() {
  console.log('--- STARTING SCHEDULE API LOGIC TEST ---');
  
  try {
    const classId = 1;
    const yearId = 1;
    const month = 7;
    const year = 2026;
    const teacherId = 5;

    // 1. Test upsertMonthlySchedule
    console.log('\n1. Testing upsertMonthlySchedule...');
    const upsertRes = await weeklyScheduleService.upsertMonthlySchedule(
      classId,
      month,
      year,
      'Chủ đề Tháng 7: Khám phá thế giới động vật dưới nước'
    );
    console.log('Upsert MS Result:', upsertRes);

    // 2. Test importFromCSV for Week 1
    console.log('\n2. Testing importFromCSV (Week 1)...');
    const mockCsvData = [
      {
        DayOfWeek: 'Monday',
        StartTime: '07:30:00',
        EndTime: '08:30:00',
        ActivityName: 'Đón trẻ & Thể dục sáng',
        ActivityType: 'pickup',
        Details: 'Cô đón bé ở cổng A',
        Location: 'Sân trường'
      },
      {
        DayOfWeek: 'Monday',
        StartTime: '08:30:00',
        EndTime: '09:00:00',
        ActivityName: 'Ăn sáng dinh dưỡng',
        ActivityType: 'meal',
        Details: 'Bánh mì sandwich bơ sữa',
        Location: 'Phòng ăn'
      }
    ];

    const importRes = await weeklyScheduleService.importFromCSV(
      mockCsvData,
      classId,
      yearId,
      month,
      year,
      1, // WeekOrder 1
      'Tuần 1: Những sinh vật đáng yêu',
      teacherId
    );
    console.log('Import WS Result:', importRes);

    // 3. Test getWeeklyScheduleTemplates (retrieves the monthly schedule + week + details)
    console.log('\n3. Testing getWeeklyScheduleTemplates...');
    const getRes = await weeklyScheduleService.getWeeklyScheduleTemplates(classId, yearId, month, year);
    console.log('Get MS Details:', JSON.stringify(getRes, null, 2));

    // 4. Test submitForApproval
    console.log('\n4. Testing submitForApproval...');
    const submitRes = await weeklyScheduleService.submitForApproval(upsertRes.monthlyScheduleId, teacherId);
    console.log('Submit MS Result:', submitRes);

    console.log('\n✅ ALL SCHEDULE SERVICE LOGIC TESTS PASSED!');

  } catch (error) {
    console.error('\n❌ TEST FAILED with error:', error);
  } finally {
    await pool.end();
  }
}

runTest();
