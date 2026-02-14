
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAchievementDetails } from '@/server/lib/progress/achievements';
import { db } from '@/db';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check and get all achievements
    // We use getAchievementDetails which calls checkAllAchievements internally
    const achievements = await getAchievementDetails(user.id, db);

    return NextResponse.json({
      achievements,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}
