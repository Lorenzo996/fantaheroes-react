# Switch to dev-local Branch
git checkout dev-local
# Perform the Find-and-Replace Operation
cd src/components
find . -type f -name "*.js" -exec sed -i '' "s|{apiUrl}/|{apiUrl}|g" {} + 
cd ../..
git add .
git commit -m "Replaced {apiURL}/... with {apiURL}..."
# Switch to main Branch
git checkout main
# Merge dev-local Branch into main Branch (Excluding Specific Files)
# use the --no-commit option to stage the changes first, then manually remove the unwanted files
git merge dev-local --no-commit 
# Restore the Excluded Files
git restore --source=main .env
git restore --source=main pushToMain.sh
# Commit the Merge
git commit -m "Merged dev-local into main, excluding .env and pushToMain.sh"
# Push the Changes to GitHub
git push origin main
# Rebuild and deploy the App
npm run deploy
# Switch back to dev-local Branch
git checkout dev-local
# Perform the Find-and-Replace Operation
cd src/components
find . -type f -name "*.js" -exec sed -i '' "s|{apiUrl}|{apiUrl}/|g" {} +
cd ../..
git add .
git commit -m "Replaced {apiURL} with {apiURL}/..."
# Push the Changes to GitHub
git push origin dev-local
