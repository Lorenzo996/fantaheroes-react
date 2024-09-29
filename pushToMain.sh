# Switch to local-dev Branch
git checkout local-dev
# Perform the Find-and-Replace Operation
find . -type f -name "*.js" -exec sed -i 's/{apiURL}\/\({.*}\)/{apiURL}\1/g' {} +
git add .
git commit -m "Replaced {apiURL}/... with {apiURL}..."
# Switch to main Branch
git checkout main
# Merge local-dev Branch into main Branch (Excluding Specific Files)
git merge local-dev --no-commit # use the --no-commit option to stage the changes first, then manually remove the unwanted files
# Restore the Excluded Files
git restore --source=main .env
git restore --source=main /fantaheroes/settings.py
git restore --source=main pushToMain.sh
# Commit the Merge
git commit -m "Merged local-dev into main, excluding .env and settings.py"
# Push the Changes to GitHub
git push origin main
# Rebuild and deploy the App
npm run deploy
# Switch back to local-dev Branch