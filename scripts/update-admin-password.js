// scripts/update-admin-password.js
// Update admin password to meet new validation requirements

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure dotenv
config({ path: join(__dirname, '..', '.env.development') });

async function updateAdminPassword() {
  console.log('🔑 Updating admin password...\n');
  
  // Dynamic imports after env is loaded
  const { db, users } = await import('../src/db/index.js');
  const { eq } = await import('drizzle-orm');
  const bcrypt = await import('bcrypt');
   
  try {
    // New password that meets validation requirements
    const newPassword = 'Admin@123';  // 8+ chars, uppercase, lowercase, number, special char
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update admin user
    const [updatedUser] = await db
      .update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.email, 'admin@example.com'))
      .returning();
    
    if (updatedUser) {
      console.log('✅ Admin password updated successfully!');
      console.log('\nNew credentials:');
      console.log('  Email: admin@example.com');
      console.log('  Password: Admin@123');
      console.log('\nPassword meets requirements:');
      console.log('  ✅ 8+ characters');
      console.log('  ✅ 1 uppercase letter');
      console.log('  ✅ 1 lowercase letter');
      console.log('  ✅ 1 number');
      console.log('  ✅ 1 special character');
    } else {
      console.log('❌ Admin user not found');
    }
    
  } catch (error) {
    console.error('❌ Error updating password:', error.message);
    process.exit(1);
  }
  
  process.exit(0);
}

updateAdminPassword();
