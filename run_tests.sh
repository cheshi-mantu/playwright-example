rm -rf ./allure-results
npm  i
npm test
echo "browser=chromium" | tee ./allure-results/environment.properties
echo "execution=local" | tee -a ./allure-results/environment.properties
echo "arch=arm64" | tee -a ./allure-results/environment.properties

npx playwright show-report
# allure serve