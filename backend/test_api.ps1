# CareerLink Automated API Test Suite
$BaseUrl = "http://localhost:5000"

function Invoke-ApiRequest {
    param(
        [string]$Uri,
        [string]$Method = "GET",
        [object]$Body = $null
    )
    $headers = @{ "Content-Type" = "application/json" }
    try {
        $jsonBody = $null
        if ($Body -ne $null) {
            $jsonBody = $Body | ConvertTo-Json -Depth 5 -Compress
        }
        $response = Invoke-WebRequest -Uri $Uri -Method $Method -Headers $headers -Body $jsonBody -UseBasicParsing -TimeoutSec 10
        $parsed = $null
        if ($response.Content) {
            $parsed = $response.Content | ConvertFrom-Json
        }
        return @{
            StatusCode = [int]$response.StatusCode
            Data = $parsed
        }
    }
    catch {
        $statusCode = 0
        $parsed = $null
        if ($_.Exception -and $_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
        }
        $rawContent = ""
        if ($_.ErrorDetails -and $_.ErrorDetails.Message) {
            $rawContent = $_.ErrorDetails.Message
        } elseif ($_.Exception -and $_.Exception.Response) {
            try {
                $stream = $_.Exception.Response.GetResponseStream()
                if ($stream) {
                    $reader = New-Object System.IO.StreamReader($stream)
                    $rawContent = $reader.ReadToEnd()
                }
            } catch {}
        }
        if ($rawContent) {
            try {
                $parsed = $rawContent | ConvertFrom-Json
            } catch {}
        }
        return @{
            StatusCode = $statusCode
            Data = $parsed
        }
    }
}

Add-Type -AssemblyName System.Web -ErrorAction SilentlyContinue

$results = [System.Collections.Generic.List[PSObject]]::new()

function Record-Test {
    param(
        [string]$Endpoint,
        [string]$Test,
        [string]$Expected,
        [string]$Actual,
        [bool]$Passed
    )
    $results.Add([PSCustomObject]@{
        Endpoint = $Endpoint
        Test = $Test
        Expected = $Expected
        Actual = $Actual
        Status = if ($Passed) { "PASS" } else { "FAIL" }
    })
}

Write-Host "Running CareerLink API Tests against $BaseUrl ..." -ForegroundColor Cyan

# 1. Health check
$res = Invoke-ApiRequest -Uri "$BaseUrl/"
$pass = ($res.StatusCode -eq 200) -and ($res.Data.message -eq "CareerLink API is up and running")
Record-Test -Endpoint "GET /" -Test "Health Check" -Expected "200, 'CareerLink API is up and running'" -Actual "$($res.StatusCode), '$($res.Data.message)'" -Passed $pass

# 2. Opportunities list default pagination
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities"
$pass = ($res.StatusCode -eq 200) -and ($res.Data.data.Count -eq 10) -and ($res.Data.pagination.total -eq 54) -and ($res.Data.pagination.pages -eq 6)
Record-Test -Endpoint "GET /api/opportunities" -Test "Default list pagination" -Expected "200, 10 items, total 54, pages 6" -Actual "$($res.StatusCode), $($res.Data.data.Count) items, total $($res.Data.pagination.total), pages $($res.Data.pagination.pages)" -Passed $pass

# Store first opportunity ID for later tests
$firstOppId = if ($res.Data.data.Count -gt 0) { $res.Data.data[0]._id } else { $null }

# 3. Search "web"
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities?search=web"
$pass = ($res.StatusCode -eq 200) -and ($res.Data.pagination.total -gt 0)
Record-Test -Endpoint "GET /api/opportunities?search=web" -Test "Search 'web'" -Expected "200, total > 0" -Actual "$($res.StatusCode), total $($res.Data.pagination.total)" -Passed $pass

# 4. Search "react"
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities?search=react"
$pass = ($res.StatusCode -eq 200) -and ($res.Data.pagination.total -ge 2)
Record-Test -Endpoint "GET /api/opportunities?search=react" -Test "Search 'react'" -Expected "200, total >= 2" -Actual "$($res.StatusCode), total $($res.Data.pagination.total)" -Passed $pass

# 5. Search "c++" (special chars escape, 0 results, no crash)
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities?search=c%2B%2B"
$pass = ($res.StatusCode -eq 200) -and ($res.Data.pagination.total -eq 0)
Record-Test -Endpoint "GET /api/opportunities?search=c++" -Test "Search 'c++' (no crash, 0 results)" -Expected "200, total 0" -Actual "$($res.StatusCode), total $($res.Data.pagination.total)" -Passed $pass

# 6. Search "(" (special chars escape, matches all, no crash)
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities?search=%28"
$pass = ($res.StatusCode -eq 200) -and ($res.Data.pagination.total -eq 54)
Record-Test -Endpoint "GET /api/opportunities?search=(" -Test "Search '(' (no crash, matches all)" -Expected "200, total 54" -Actual "$($res.StatusCode), total $($res.Data.pagination.total)" -Passed $pass

# 7. Domain filters for all 16 domains with exact counts
$domainMap = @{
    "Web Development" = 4
    "Full Stack Development" = 4
    "Python Development" = 4
    "Java Development" = 3
    "Data Science" = 4
    "Data Analytics" = 3
    "AI%2FML" = 4
    "Mobile Development" = 3
    "UI%2FUX Design" = 3
    "Cybersecurity" = 3
    "Cloud %26 DevOps" = 4
    "Software Testing" = 3
    "Embedded %26 IoT" = 3
    "Game Development" = 3
    "Blockchain" = 3
    "Digital Marketing" = 3
}

foreach ($domKey in $domainMap.Keys) {
    $expectedCount = $domainMap[$domKey]
    $res = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities?domain=$domKey"
    $pass = ($res.StatusCode -eq 200) -and ($res.Data.pagination.total -eq $expectedCount)
    Record-Test -Endpoint "GET /api/opportunities?domain=$domKey" -Test "Domain filter '$domKey'" -Expected "200, total $expectedCount" -Actual "$($res.StatusCode), total $($res.Data.pagination.total)" -Passed $pass
}

# 8. Distinct domains list
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities/domains"
$pass = ($res.StatusCode -eq 200) -and ($res.Data.data.Count -eq 16)
Record-Test -Endpoint "GET /api/opportunities/domains" -Test "Distinct domains sorted A-Z" -Expected "200, 16 domains" -Actual "$($res.StatusCode), $($res.Data.data.Count) domains" -Passed $pass

# 9. Type filter: Internship (36) and Job (18)
$resIntern = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities?type=Internship"
$resJob = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities?type=Job"
$pass = ($resIntern.StatusCode -eq 200) -and ($resIntern.Data.pagination.total -eq 36) -and ($resJob.StatusCode -eq 200) -and ($resJob.Data.pagination.total -eq 18)
Record-Test -Endpoint "GET /api/opportunities?type=..." -Test "Type filter" -Expected "Internship: 36, Job: 18" -Actual "Internship: $($resIntern.Data.pagination.total), Job: $($resJob.Data.pagination.total)" -Passed $pass

# 10. Experience filter: Fresher (36)
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities?experience=Fresher"
$pass = ($res.StatusCode -eq 200) -and ($res.Data.pagination.total -eq 36)
Record-Test -Endpoint "GET /api/opportunities?experience=Fresher" -Test "Experience filter 'Fresher'" -Expected "200, total 36" -Actual "$($res.StatusCode), total $($res.Data.pagination.total)" -Passed $pass

# 11. Location filter (partial case-insensitive)
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities?location=bengaluru"
$pass = ($res.StatusCode -eq 200) -and ($res.Data.pagination.total -gt 0)
Record-Test -Endpoint "GET /api/opportunities?location=bengaluru" -Test "Location partial match" -Expected "200, total > 0" -Actual "$($res.StatusCode), total $($res.Data.pagination.total)" -Passed $pass

# 12. Sort newest vs oldest
$resNewest = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities?sort=newest&limit=1"
$resOldest = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities?sort=oldest&limit=1"
$newestDate = [DateTime]$resNewest.Data.data[0].createdAt
$oldestDate = [DateTime]$resOldest.Data.data[0].createdAt
$pass = ($newestDate -gt $oldestDate)
Record-Test -Endpoint "GET /api/opportunities?sort=..." -Test "Sort newest vs oldest" -Expected "Newest date > Oldest date" -Actual "Newest: $newestDate, Oldest: $oldestDate" -Passed $pass

# 13. Pagination across all 6 pages + page 7
$collectedIds = [System.Collections.Generic.HashSet[string]]::new()
for ($p = 1; $p -le 6; $p++) {
    $resPage = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities?page=$p&limit=10"
    foreach ($item in $resPage.Data.data) {
        $collectedIds.Add($item._id) | Out-Null
    }
}
$resPage7 = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities?page=7&limit=10"
$pass = ($collectedIds.Count -eq 54) -and ($resPage7.StatusCode -eq 200) -and ($resPage7.Data.data.Count -eq 0)
Record-Test -Endpoint "GET /api/opportunities?page=1..7" -Test "Full pagination stability (pages 1-6 unique 54, page 7 empty)" -Expected "54 unique IDs, page 7 empty" -Actual "$($collectedIds.Count) unique IDs, page 7 count $($resPage7.Data.data.Count)" -Passed $pass

# 14. Clamped limit (limit above 50 clamped to 50)
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities?limit=100"
$pass = ($res.StatusCode -eq 200) -and ($res.Data.pagination.limit -eq 50) -and ($res.Data.data.Count -eq 50)
Record-Test -Endpoint "GET /api/opportunities?limit=100" -Test "Limit clamp to 50" -Expected "Limit 50, count 50" -Actual "Limit $($res.Data.pagination.limit), count $($res.Data.data.Count)" -Passed $pass

# 15. Get opportunity by valid ID
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities/$firstOppId"
$pass = ($res.StatusCode -eq 200) -and ($res.Data.data._id -eq $firstOppId)
Record-Test -Endpoint "GET /api/opportunities/:id" -Test "Get by valid ID" -Expected "200, matching ID" -Actual "$($res.StatusCode), ID $($res.Data.data._id)" -Passed $pass

# 16. Get opportunity by invalid ID format
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities/invalid-id-xyz"
$pass = ($res.StatusCode -eq 400)
Record-Test -Endpoint "GET /api/opportunities/invalid-id" -Test "Get by invalid ID" -Expected "400" -Actual "$($res.StatusCode)" -Passed $pass

# 17. Get opportunity by nonexistent ID
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities/507f1f77bcf86cd799439011"
$pass = ($res.StatusCode -eq 404)
Record-Test -Endpoint "GET /api/opportunities/:nonexistent" -Test "Get by nonexistent ID" -Expected "404" -Actual "$($res.StatusCode)" -Passed $pass

# 18. Create valid opportunity (with skills and salary)
$createPayload = @{
    title = "Test Automation Intern"
    company = "QA Benchmark Labs"
    domain = "Software Testing"
    location = "Bengaluru, India (Remote)"
    experience = "Fresher"
    type = "Internship"
    description = "Test opportunity description to verify creating an opportunity with realistic fields. This text is sufficiently long to pass all validation checks."
    skills = @("Cypress", "JavaScript", "Jest", "Git", "cypress", "")
    salary = "₹15,000 - ₹20,000 /month"
    applicationLink = "https://example.com/apply/qa-benchmark-labs-test-automation-intern"
}
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities" -Method "POST" -Body $createPayload
$createdOppId = if ($res.Data.data) { $res.Data.data._id } else { $null }
$cleanedSkillsCount = if ($res.Data.data) { $res.Data.data.skills.Count } else { 0 }
$pass = ($res.StatusCode -eq 201) -and ($createdOppId -ne $null) -and ($cleanedSkillsCount -eq 4)
Record-Test -Endpoint "POST /api/opportunities" -Test "Create valid (dedupes skills, trims, removes empty)" -Expected "201, 4 cleaned skills" -Actual "$($res.StatusCode), $cleanedSkillsCount skills" -Passed $pass

# 19. Create with missing fields
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities" -Method "POST" -Body @{ title = "Incomplete" }
$pass = ($res.StatusCode -eq 400)
Record-Test -Endpoint "POST /api/opportunities" -Test "Create with missing fields" -Expected "400" -Actual "$($res.StatusCode)" -Passed $pass

# 20. Create with bad URL
$badUrlPayload = @{
    title = "Bad Link Role"
    company = "Bad Link Labs"
    domain = "Web Development"
    location = "Pune, India (Remote)"
    experience = "Fresher"
    type = "Internship"
    description = "A valid description for testing bad URL handling across the opportunity creation pipeline. Sufficiently long test text."
    applicationLink = "ftp://invalid-url"
}
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities" -Method "POST" -Body $badUrlPayload
$pass = ($res.StatusCode -eq 400)
Record-Test -Endpoint "POST /api/opportunities" -Test "Create with invalid URL" -Expected "400" -Actual "$($res.StatusCode)" -Passed $pass

# 21. Update opportunity
$updatePayload = @{
    title = "Senior Test Automation Intern"
    salary = "₹20,000 - ₹25,000 /month"
}
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities/$createdOppId" -Method "PUT" -Body $updatePayload
$pass = ($res.StatusCode -eq 200) -and ($res.Data.data.title -eq "Senior Test Automation Intern")
Record-Test -Endpoint "PUT /api/opportunities/:id" -Test "Update opportunity" -Expected "200, updated title" -Actual "$($res.StatusCode), title '$($res.Data.data.title)'" -Passed $pass

# 22. Apply valid to the created opportunity
$applyPayload = @{
    opportunity = $createdOppId
    name = "Candidate One"
    email = "candidate1@example.com"
    phone = "9876543210"
    message = "I am excited to apply for this test internship."
}
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/applications" -Method "POST" -Body $applyPayload
$createdAppId = if ($res.Data.data) { $res.Data.data._id } else { $null }
$hasPopulatedOpp = ($res.Data.data.opportunity -ne $null) -and ($res.Data.data.opportunity.title -ne $null)
$pass = ($res.StatusCode -eq 201) -and ($createdAppId -ne $null) -and $hasPopulatedOpp
Record-Test -Endpoint "POST /api/applications" -Test "Apply valid (populated response)" -Expected "201, populated opportunity" -Actual "$($res.StatusCode), populated: $hasPopulatedOpp" -Passed $pass

# 23. Apply duplicate (same email and opportunity)
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/applications" -Method "POST" -Body $applyPayload
$pass = ($res.StatusCode -eq 409) -and ($res.Data.message -eq "You have already applied for this opportunity with this email address")
Record-Test -Endpoint "POST /api/applications" -Test "Apply duplicate (409 conflict)" -Expected "409, duplicate message" -Actual "$($res.StatusCode), '$($res.Data.message)'" -Passed $pass

# 24. Apply to nonexistent opportunity
$nonexistentAppPayload = @{
    opportunity = "507f1f77bcf86cd799439011"
    name = "Candidate Two"
    email = "candidate2@example.com"
    phone = "9876543210"
}
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/applications" -Method "POST" -Body $nonexistentAppPayload
$pass = ($res.StatusCode -eq 404)
Record-Test -Endpoint "POST /api/applications" -Test "Apply to nonexistent opportunity" -Expected "404" -Actual "$($res.StatusCode)" -Passed $pass

# 25. Apply with bad email
$badEmailPayload = @{
    opportunity = $createdOppId
    name = "Candidate Three"
    email = "invalid-email-address"
    phone = "9876543210"
}
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/applications" -Method "POST" -Body $badEmailPayload
$pass = ($res.StatusCode -eq 400)
Record-Test -Endpoint "POST /api/applications" -Test "Apply with bad email format" -Expected "400" -Actual "$($res.StatusCode)" -Passed $pass

# 26. Apply with bad phone (not 10 digits)
$badPhonePayload = @{
    opportunity = $createdOppId
    name = "Candidate Four"
    email = "candidate4@example.com"
    phone = "12345"
}
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/applications" -Method "POST" -Body $badPhonePayload
$pass = ($res.StatusCode -eq 400)
Record-Test -Endpoint "POST /api/applications" -Test "Apply with bad phone (not 10 digits)" -Expected "400" -Actual "$($res.StatusCode)" -Passed $pass

# 27. List applications (admin list)
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/applications"
$pass = ($res.StatusCode -eq 200) -and ($res.Data.data.Count -gt 0)
Record-Test -Endpoint "GET /api/applications" -Test "List applications (populated)" -Expected "200, count > 0" -Actual "$($res.StatusCode), count $($res.Data.data.Count)" -Passed $pass

# 28. Filter applications by opportunity
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/applications?opportunity=$createdOppId"
$pass = ($res.StatusCode -eq 200) -and ($res.Data.data.Count -eq 1)
Record-Test -Endpoint "GET /api/applications?opportunity=:id" -Test "Filter applications by opportunity" -Expected "200, count 1" -Actual "$($res.StatusCode), count $($res.Data.data.Count)" -Passed $pass

# 29. Delete opportunity (and verify associated applications are deleted)
$res = Invoke-ApiRequest -Uri "$BaseUrl/api/opportunities/$createdOppId" -Method "DELETE"
$resAppsAfterDelete = Invoke-ApiRequest -Uri "$BaseUrl/api/applications?opportunity=$createdOppId"
$pass = ($res.StatusCode -eq 200) -and ($resAppsAfterDelete.Data.data.Count -eq 0)
Record-Test -Endpoint "DELETE /api/opportunities/:id" -Test "Delete opportunity + cascade applications" -Expected "200, associated applications deleted (0 remaining)" -Actual "$($res.StatusCode), $($resAppsAfterDelete.Data.data.Count) apps remaining" -Passed $pass

Write-Host "`nTest Execution Finished. Results Summary:`n" -ForegroundColor Green

$results | Format-Table -Property Endpoint, Test, Expected, Actual, Status -AutoSize

$failedCount = @($results | Where-Object { $_.Status -eq "FAIL" }).Count
if ($failedCount -eq 0) {
    Write-Host "`nAll $($results.Count) tests PASSED successfully!`n" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n$failedCount tests FAILED out of $($results.Count)!`n" -ForegroundColor Red
    exit 1
}

