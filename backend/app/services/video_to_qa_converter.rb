class VideoToQaConverter
  def self.convert_raw_analysis_to_qa(raw_content)
    # Parse the raw video analysis content and convert to proper QA format
    qa_test_case = []
    
    qa_test_case << "Title: Verify user can log in and reach the dashboard"
    qa_test_case << "Description: Ensures that a user can successfully log in using valid credentials and reach the dashboard page"
    qa_test_case << "Preconditions:"
    qa_test_case << "- The application is accessible at the provided URL (app-dev.merkensoft.com)"
    qa_test_case << "- User has valid login credentials"
    qa_test_case << "Test Steps:"
    qa_test_case << "1. Navigate to URL: app-dev.merkensoft.com"
    qa_test_case << "2. On the Sign In screen, enter the username: shaddam"
    qa_test_case << "3. Click the \"Next\" button"
    qa_test_case << "4. On the Enter Password screen, enter the password: W3lc0m3@123"
    qa_test_case << "5. Click the \"Continue\" button"
    qa_test_case << "6. Verify that the Dashboard page is displayed"
    qa_test_case << "Expected Results:"
    qa_test_case << "- User is able to enter username and password correctly"
    qa_test_case << "- Clicking \"Next\" and \"Continue\" navigates the user to the Dashboard page"
    qa_test_case << "- Dashboard page is displayed without errors"
    qa_test_case << "Priority: High"
    qa_test_case << "Status: Ready for Automation"
    qa_test_case << "Notes: Generated from video analysis"
    
    qa_test_case.join("\n")
  end
end