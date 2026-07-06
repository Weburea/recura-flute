const { execSync } = require('child_process');

try {
  console.log('Configuring Git user name and email to Weburea...');
  
  // Set local config
  execSync('git config user.name "Weburea"', { stdio: 'inherit' });
  execSync('git config user.email "Weburea@users.noreply.github.com"', { stdio: 'inherit' });
  console.log('✓ Local git user.name set to "Weburea" and email to "Weburea@users.noreply.github.com"');
  
  // Set global config
  execSync('git config --global user.name "Weburea"', { stdio: 'inherit' });
  execSync('git config --global user.email "Weburea@users.noreply.github.com"', { stdio: 'inherit' });
  console.log('✓ Global git user.name set to "Weburea" and email to "Weburea@users.noreply.github.com"');

  // Reset the last 2 commits (Testimonials & Alternating Mockups) to combine them into one clean commit under Weburea
  console.log('\nConsolidating recent commits under Weburea...');
  execSync('git reset --soft HEAD~2', { stdio: 'inherit' });
  execSync('git commit -m "Redesign marketing landing page: update hero mockup casing, brands grid, services layout, stats count up animations, testimonials, and integrations grid"', { stdio: 'inherit' });
  console.log('✓ Commits consolidated successfully under Weburea author and committer.');
  
  console.log('\nGit configuration completed successfully!');
  console.log('To update GitHub and trigger Vercel deployment, please run: git push --force-with-lease');
} catch (error) {
  console.error('Error configuring Git:', error.message);
}
