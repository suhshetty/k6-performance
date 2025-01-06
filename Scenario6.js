import http from 'k6/http';
import { check, sleep } from 'k6';
 
// Declare cookieHeader outside the default function
let cookieHeader = '';
 
export const options = {
  vus: 1, // Number of virtual users
  duration: '3m', // Duration of the test
};
 
export default function () {
  // Fetch cookies from the GitHub repository during the test execution
  if (!cookieHeader) {
    const cookiesUrl = 'https://raw.githubusercontent.com/suhshetty/c4/main/cookies.json';
    const response = http.get(cookiesUrl);
 
    // Parse cookies from the response body
    const cookies = JSON.parse(response.body);
 
    // Print the fetched cookies for verification
    console.log('Fetched Cookies:', JSON.stringify(cookies));
 
    // Check if ASP.NET_SessionId exists in cookies
    const aspNetSessionIdCookie = cookies.find(cookie => cookie.name === 'ASP.NET_SessionId');
    if (aspNetSessionIdCookie) {
      console.log('ASP.NET_SessionId cookie value:', aspNetSessionIdCookie.value);
    } else {
      console.log('ASP.NET_SessionId cookie not found!');
    }
 
    // Convert cookies into a "Cookie" header string
    cookieHeader = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ');
 
    // Print the cookie header to verify
    console.log('Loaded Cookie Header:', cookieHeader);
  }
 
  // Login request
  const loginUrl = 'https://kommune.mainmanager.is/mmv2/MMV2Login.aspx';
  const loginPayload = {
    'lgnUserLogin$UserName': 'NAV',
    'lgnUserLogin$Password': 'Testing@!123',
    'lgnUserLogin$Login': 'Login',
  };
 
  const loginHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': cookieHeader, // Add the cookie header
  };
 
  // Pause test for a moment
  sleep(2);
 
  const loginResponse = http.post(loginUrl, loginPayload, { headers: loginHeaders, timeout: '120s' });
 
  // Pause test for a moment
  sleep(2);
 
  // Check if the login request was successful
  check(loginResponse, {
    'Step 1 : Login successful': (res) => res.status === 200,
  });
 
  // Print the response headers to ensure the cookie is being sent
  console.log('Response Headers:', JSON.stringify(loginResponse.headers));
  sleep(2); // Pause test
 
 
 
 
 
 
 
 
 
  // Step 2a : Select Operation and Maintenance
  const operation_and_maintenance_url = 'https://kommune.mainmanager.is/mmv2/services/MMLayoutReadOnly.asmx/GetMenuItemSteps';
 
  // Define the payload as JSON
  const operation_and_maintenance_payload = JSON.stringify({
    Tag: "OperationAndMaintenance"
  });
 
  // Define the headers
  const operation_and_maintenance_headers = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };
  sleep(2); // Pause test
  // Send POST request
  const operation_and_maintenance_response = http.post(operation_and_maintenance_url, operation_and_maintenance_payload, { headers: operation_and_maintenance_headers, timeout: "120s" });
  sleep(2); // Pause test
  // Validate response
  check(operation_and_maintenance_response, {
    'Step 2a : Select Operation and Maintenance, Status is 200': (r) => r.status === 200,
    'Step 2a : Response contains "OperationAndMaintenance"': (r) => r.body.includes('OperationAndMaintenance'),
  });
 
  // Log the response for debugging
  console.log('Step 2a : -----> Operation and Maintenance Body:', operation_and_maintenance_response.body);
 
  sleep(2); // Pause test
 
  // Step 2b : Select Operation and Maintenance
  const task_planning_url = 'https://kommune.mainmanager.is/mmv2/services/MMLayoutReadOnly.asmx/GetMenuItemProcessItems';
 
  // Define the payload as JSON
  const task_planning_payload = JSON.stringify({
    Parent: "OperationAndMaintenance",
    Tag: "TaskPlanning"
  });
 
  // Define the headers
  const task_planning_headers = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };
  sleep(2); // Pause test
  // Send POST request
  const task_planning_response = http.post(task_planning_url, task_planning_payload, { headers: task_planning_headers, timeout: "120s" });
  sleep(2); // Pause test
  // Validate response
  check(task_planning_response, {
    'Step 2b : Select Operation and Maintenance, Status is 200': (r) => r.status === 200,
    'Step 2b : Response contains "OperationAndMaintenance"': (r) => r.body.includes('OperationAndMaintenance'),
  });
 
  // Log the response for debugging
  console.log('Step 2b : -----> Select Operation and Maintenance:', task_planning_response.body);
 
  sleep(2); // Pause test
 
  // Step 3 : Select Work order overview
  const requests_url = 'https://kommune.mainmanager.is/mmv2/services/MMLayoutReadOnly.asmx/GetMenuItemProcessItems';
 
  // Define the payload as JSON
  const requests_payload = JSON.stringify({
    Parent: "OperationAndMaintenance",
    Tag: "Requests"
  });
 
  // Define the headers
  const requests_headers = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };
  sleep(2); // Pause test
  // Send POST request
  const requests_response = http.post(requests_url, requests_payload, { headers: requests_headers , timeout: "120s"});
  sleep(2); // Pause test
  // Validate response
  check(requests_response, {
    'Step 3 : Select Work order overview, Status is 200': (r) => r.status === 200,
    'Step 3 : Response contains "Work orders"': (r) => r.body.includes('Work orders'),
  });
 
  // Log the response for debugging
  console.log('Step 3 : -----> Select Work order overview body:', requests_response.body);
 
  sleep(2); // Pause test
 
  // Step 4a : Click on Work Orders
  const init_main_layout_url = 'https://kommune.mainmanager.is/mmv2/services/MMLayout.asmx/InitMainLayout';
 
  // Define the payload as JSON
  const init_main_layout_payload = JSON.stringify({
    UniqueString: "",
    MenuItemKey: "Request",
    SummaryID: 0,
    MenuItemID: 1133,
    MenuItemTypeID: 1,
    ProcessStepTag: "Requests",
    ProcessTag: "OperationAndMaintenance",
    SnapshotID: 0
  });
 
  // Define the headers
  const init_main_layout_headers = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };
  sleep(2); // Pause test
  // Send POST request
  const init_main_layout_response = http.post(init_main_layout_url, init_main_layout_payload, { headers: init_main_layout_headers, timeout: "120s" });
  sleep(2); // Pause test
  // Validate response
  check(init_main_layout_response, {
    'Step 4a : Click on Work Orders, Status is 200': (r) => r.status === 200,
    'Step 4a : Response contains "Ekstern deadline ordre"': (r) => r.body.includes('Ekstern deadline ordre'),
  });
 
  // Log the response for debugging
  console.log('Step 4a : -----> Click on Work Orders Body:', init_main_layout_response.body);
 
  sleep(2); // Pause test
 
 
 
  // Step 4b : Click on Work Orders
  const get_mm_list_headers_url = 'https://kommune.mainmanager.is/mmv2/restapi/List/GetMMListHeaders?DataPath=Request%241%240&UniqueString=ddc3f428aaec43cbb4d3d2f6849e9b26&Gantt=False&PopupSQLListIndex=0&_1733734358981';
 
  // Define the headers
  const get_mm_list_headers_headers = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };
 
  // Send GET request
  const get_mm_list_headers_response = http.get(get_mm_list_headers_url, { headers: get_mm_list_headers_headers, timeout: "120s" });
 
  // Validate response
  check(get_mm_list_headers_response, {
    'Step 4b : Click on Work Orders, Status is 200': (r) => r.status === 200,
    'Step 4b : Response contains "caption"': (r) => r.body.includes('caption'),
  });
 
  // Log the response for debugging
  console.log('Step 4b : -----> Click on Work Orders Body:', get_mm_list_headers_response.body);
 
  // Step 5 : Empty Data Filter
  const empty_data_filter_url = 'https://kommune.mainmanager.is/mmv2/services/MMLayout.asmx/EmptyDataFilter';
 
  // Define the payload
  const empty_data_filter_payload = JSON.stringify({
    DataTag: "Request",
    Value: [
      "DataFilter_TFSearchText#",
      "DataFilter_TFDateFilterID#1000",
      "DataFilter_TFTimeLimitINPUT#All years",
      "DataFilter_TFTimeLimit#;",
      "DataFilter_TFMainTypeID#0",
      "DataFilter_TFAssignmentCategoryID#0",
      "DataFilter_TFFinanceDataSetID#0",
      "DataFilter_TFAccountID#0",
      "DataFilter_TFMaintenanceCategoryID#0",
      "DataFilter_TFCategoryID#0",
      "DataFilter_TFOrganisationFromID#0",
      "DataFilter_TFOwnerID#0",
      "DataFilter_TFOrganisationToID#0",
      "DataFilter_TFEmployeeToID#0",
      "DataFilter_TFFinishBehindSchedule#false",
      "DataFilter_TFStatus#5,14",
    ],
  });
 
  // Define the headers
  const empty_data_filter_headers = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };
  sleep(2); // Pause test
  // Send POST request
  const empty_data_filter_response = http.post(empty_data_filter_url, empty_data_filter_payload, { headers: empty_data_filter_headers , timeout: "120s"});
  sleep(2); // Pause test
  // Validate response
  check(empty_data_filter_response, {
    'Step 5 : Empty Data Filter, Status is 200': (r) => r.status === 200,
    'Step 5 : Response contains "StandardFilter"': (r) => r.body.includes('StandardFilter'),
  });
 
  // Log the response for debugging
  console.log('Step 5 : -----> Empty Data Filter Body:', empty_data_filter_response.body);
 
  sleep(2); // Pause test
 
  // Step 6 : Open a work order
  const load_mm_modal_control_url = 'https://kommune.mainmanager.is/mmv2/services/MMLayout.asmx/LoadMMModalControl';
 
  // Define the payload
  const load_mm_modal_control_payload = JSON.stringify({
    tag: "Request",
    datapath: "Request$1$81245",
    id: "81245",
    PopupSQLListIndex: 0,
    UserRoleID: 0,
    contenttype: "7",
    datatext: "Open work order",
    editMode: 1,
    extraparameters: "",
    idselection: [],
    modal: "1",
    norestore: "",
    savebuttonvalue: 0,
    templateid: 0,
    uniquestring: "ddc3f428aaec43cbb4d3d2f6849e9b26",
    viewkey: "UseDefaultViewKey",
  });
 
  // Define the headers
  const load_mm_modal_control_headers = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };
  sleep(2); // Pause test
  // Send POST request
  const load_mm_modal_control_response = http.post(
    load_mm_modal_control_url,
    load_mm_modal_control_payload,
    { headers: load_mm_modal_control_headers }
  );
  sleep(2); // Pause test
  // Validate response
  check(load_mm_modal_control_response, {
    'Step 6 : Open a work order , Status is 200': (r) => r.status === 200,
   
  });
 
  // Log the response for debugging
  console.log('Step 6 : -----> Open a work order Body:', load_mm_modal_control_response.body);
 
  sleep(2); // Pause test
 
  // Step 7a : Select Operation and Maintenance
  const op_and_maint_url = 'https://kommune.mainmanager.is/mmv2/services/MMLayoutReadOnly.asmx/GetMenuItemSteps';
 
  // Define the payload as JSON
  const op_and_maint_payload = JSON.stringify({
    Tag: "OperationAndMaintenance"
  });
 
  // Define the headers
  const op_and_maint_headers = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };
  sleep(2); // Pause test
  // Send POST request
  const op_and_maint_response = http.post(op_and_maint_url, op_and_maint_payload, { headers: op_and_maint_headers, timeout: "120s" });
  sleep(2); // Pause test
  // Validate response
  check(op_and_maint_response, {
    'Step 7a : Select Operation and Maintenance, Status is 200': (r) => r.status === 200,
    'Step 7a : Response contains "OperationAndMaintenance"': (r) => r.body.includes('OperationAndMaintenance'),
  });
 
  // Log the response for debugging
  console.log('Step 7a : -----> Operation and Maintenance Body:', op_and_maint_response.body);
 
  sleep(2); // Pause test
 
  // Step 7b : Select Task Planning
  const task_plan_url = 'https://kommune.mainmanager.is/mmv2/services/MMLayoutReadOnly.asmx/GetMenuItemProcessItems';
 
  // Define the payload as JSON
  const task_plan_payload = JSON.stringify({
    Parent: "OperationAndMaintenance",
    Tag: "TaskPlanning"
  });
 
  // Define the headers
  const task_plan_headers = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };
  sleep(2); // Pause test
  // Send POST request
  const task_plan_response = http.post(task_plan_url, task_plan_payload, { headers: task_plan_headers , timeout: "120s"});
  sleep(2); // Pause test
  // Validate response
  check(task_plan_response, {
    'Step 7b : Select Operation and Maintenance, Status is 200': (r) => r.status === 200,
    'Step 7b : Response contains "OperationAndMaintenance"': (r) => r.body.includes('OperationAndMaintenance'),
  });
 
  // Log the response for debugging
  console.log('Step 7b : -----> Task Planning Body:', task_plan_response.body);
 
  sleep(2); // Pause test
 
  // Step 8 : Select Work Order Overview
  const work_order_overview_url = 'https://kommune.mainmanager.is/mmv2/services/MMLayoutReadOnly.asmx/GetMenuItemProcessItems';
 
  // Define the payload as JSON
  const work_order_payload = JSON.stringify({
    Parent: "OperationAndMaintenance",
    Tag: "Requests"
  });
 
  // Define the headers
  const work_order_headers = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };
  sleep(2); // Pause test
  // Send POST request
  const work_order_response = http.post(work_order_overview_url, work_order_payload, { headers: work_order_headers, timeout: "120s" });
  sleep(2); // Pause test
 
  // Validate response
  check(work_order_response, {
    'Step 8 : Select Work order overview, Status is 200': (r) => r.status === 200,
    'Step 8 : Response contains "Work orders"': (r) => r.body.includes('Work orders'),
  });
 
  // Log the response for debugging
  console.log('Step 8 : -----> Work Order Overview Body:', work_order_response.body);
 
  sleep(2); // Pause test
 
  // Step 9a : Click on Work Orders
  const main_layout_url = 'https://kommune.mainmanager.is/mmv2/services/MMLayout.asmx/InitMainLayout';
 
  // Define the payload as JSON
  const main_layout_payload = JSON.stringify({
    UniqueString: "",
    MenuItemKey: "Request",
    SummaryID: 0,
    MenuItemID: 1133,
    MenuItemTypeID: 1,
    ProcessStepTag: "Requests",
    ProcessTag: "OperationAndMaintenance",
    SnapshotID: 0
  });
 
  // Define the headers
  const main_layout_headers = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };
  sleep(2); // Pause test
  // Send POST request
  const main_layout_response = http.post(main_layout_url, main_layout_payload, { headers: main_layout_headers, timeout: "120s" });
  sleep(2); // Pause test
  // Validate response
  check(main_layout_response, {
    'Step 9a : Click on Work Orders, Status is 200': (r) => r.status === 200,
    'Step 9a : Response contains "Ekstern deadline ordre"': (r) => r.body.includes('Ekstern deadline ordre'),
  });
 
  // Log the response for debugging
  console.log('Step 9a : -----> Work Orders Body:', main_layout_response.body);
 
  sleep(2); // Pause test
 
  // Step 9b : Fetch Work Orders List Headers
  const list_headers_url = 'https://kommune.mainmanager.is/mmv2/restapi/List/GetMMListHeaders?DataPath=Request%241%240&UniqueString=ddc3f428aaec43cbb4d3d2f6849e9b26&Gantt=False&PopupSQLListIndex=0&_1733734358981';
 
  // Define the headers
  const list_headers_headers = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };
  sleep(2); // Pause test
  // Send GET request
  const list_headers_response = http.get(list_headers_url, { headers: list_headers_headers, timeout: "120s" });
  sleep(2); // Pause test
  // Validate response
  check(list_headers_response, {
    'Step 9b : Click on Work Orders, Status is 200': (r) => r.status === 200,
    'Step 9b : Response contains "caption"': (r) => r.body.includes('caption'),
  });
 
  // Log the response for debugging
  console.log('Step 9b : -----> Work Orders List Headers Body:', list_headers_response.body);
 
  sleep(2); // Pause test
 
  // Step 10 : Fetch Combobox Data for Lease Contracts
  const combobox_data_url = 'https://kommune.mainmanager.is/mmv2/restapi/List/ComboboxData?DataPath=PurchaseOrderIncident%241%240%7CGroundID%2412%240&UniqueString=ce4ad9a6e9814da7ae038d7379ecd0d9&p=1&q=';
 
  // Define the headers
  const combobox_data_headers = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };
  sleep(2); // Pause test
  // Send GET request
  const combobox_data_response = http.get(combobox_data_url, { headers: combobox_data_headers, timeout: "120s" });
  sleep(2); // Pause test
 
  // Validate response
  check(combobox_data_response, {
    'Step 10 : Fetch Combobox Data for Lease Contracts, Status is 200': (r) => r.status === 200,
    //'Step 10 : Response contains "Show all sites"': (r) => r.body.includes('Show all sites'),
  });
 
  // Log the response for debugging
  console.log('Step 10 : -----> Combobox Data Response Body:', combobox_data_response.body);
 
  sleep(2); // Pause test
 
  // Step 11 : Fetch MM List Data for Lease Contracts( Aktivitetscenter )
  const mm_list_url = 'https://kommune.mainmanager.is/mmv2/restapi/List/GetMMList';
 
  // Define the headers
  const mm_list_headers = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };
  sleep(2); // Pause test
  // Send POST request
  const mm_list_response = http.post(mm_list_url, null, { headers: mm_list_headers, timeout: "120s" });
  sleep(2); // Pause test
  // Validate response
  check(mm_list_response, {
    'Step 11 : Fetch MM List Data for Lease Contracts (  Aktivitetscenter ), Status is 200': (r) => r.status === 200,
    'Step 11 : Response contains "recordsTotal"': (r) => r.body.includes('recordsTotal'),
  });
 
  // Log the response for debugging
  console.log('Step 11 : -----> MM List Data Response Body:', mm_list_response.body);
 
  sleep(2); // Pause test
 
  // Step 12 : Fetch Work Orders List Headers2
  const list_headers_url2 = 'https://kommune.mainmanager.is/mmv2/restapi/List/GetMMListHeaders?DataPath=Request%241%240&UniqueString=ddc3f428aaec43cbb4d3d2f6849e9b26&Gantt=False&PopupSQLListIndex=0&_1733734358981';
 
  // Define the headers
  const list_headers_headers2 = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };
  sleep(2); // Pause test
  // Send GET request
  const list_headers_response2 = http.get(list_headers_url2, { headers: list_headers_headers2, timeout: "120s" });
  sleep(2); // Pause test
  // Validate response
  check(list_headers_response2, {
    'Step 12 : Click on Work Orders, Status is 200': (r) => r.status === 200,
    'Step 12 : Response contains "caption"': (r) => r.body.includes('caption'),
  });
 
  // Log the response for debugging
  console.log('Step 12 : -----> Work Orders List Headers Body2:', list_headers_response2.body);
 
  sleep(2); // Pause test
 
  // Step 13 : Clear the filter for Site
  const refresh_main_man_filter_url = 'https://kommune.mainmanager.is/mmv2/services/MMLayout.asmx/RefreshMainManFilter';
 
  // Define the payload as JSON
  const refresh_main_man_filter_payload = JSON.stringify({
    DataTag: "PurchaseOrderIncident",
    ControlIDChanged: "MainManFilter_TFGroundID",
    Value: [
      "MainManFilter_TFRegionID#0",
      "MainManFilter_TFMainGroupID#0",
      "MainManFilter_TFGroundID#0",
      "MainManFilter_TFMainID#57810"
    ]
  });
 
  // Define the headers
  const refresh_main_man_filter_headers = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };
  sleep(2); // Pause test
  // Send POST request
  const refresh_main_man_filter_response = http.post(refresh_main_man_filter_url, refresh_main_man_filter_payload, { headers: refresh_main_man_filter_headers, timeout: "120s" });
  sleep(2); // Pause test
  // Validate response
  check(refresh_main_man_filter_response, {
    'Step 13 : Clear the filter for Site, Status is 200': (r) => r.status === 200,
    'Step 13 : Response contains "Site:"': (r) => r.body.includes('Site'),
   
  });
 
  // Log the response for debugging
  console.log('Step 13 : -----> Clear the filter for Siter Response Body:', refresh_main_man_filter_response.body);
 
  sleep(2); // Pause test
 
  // Step 14a : Select Operation and Maintenance
  const operation_and_maintenance_url_ = 'https://kommune.mainmanager.is/mmv2/services/MMLayoutReadOnly.asmx/GetMenuItemSteps';
 
  // Define the payload as JSON
  const operation_and_maintenance_payload_ = JSON.stringify({
    Tag: "OperationAndMaintenance"
  });
 
  // Define the headers
  const operation_and_maintenance_headers_ = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };
 
  sleep(2); // Pause test
  // Send POST request
  const operation_and_maintenance_response_ = http.post(operation_and_maintenance_url_, operation_and_maintenance_payload_, { headers: operation_and_maintenance_headers_, timeout: "120s" });
  sleep(2); // Pause test
 
  // Validate response
  check(operation_and_maintenance_response_, {
    'Step 14a : Select Operation and Maintenance, Status is 200': (r) => r.status === 200,
    'Step 14a : Response contains "OperationAndMaintenance"': (r) => r.body.includes('OperationAndMaintenance'),
  });
 
  // Log the response for debugging
  console.log('Step 14a : -----> Operation and Maintenance Body:', operation_and_maintenance_response_.body);
 
  sleep(2); // Pause test
 
  // Step 14b : Select Operation and Maintenance
  const task_planning_url_ = 'https://kommune.mainmanager.is/mmv2/services/MMLayoutReadOnly.asmx/GetMenuItemProcessItems';
 
  // Define the payload as JSON
  const task_planning_payload_ = JSON.stringify({
    Parent: "OperationAndMaintenance",
    Tag: "TaskPlanning"
  });
 
  // Define the headers
  const task_planning_headers_ = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };
  sleep(2); // Pause test
  // Send POST request
  const task_planning_response_ = http.post(task_planning_url_, task_planning_payload_, { headers: task_planning_headers_ , timeout: "120s"});
  sleep(2); // Pause test
  // Validate response
  check(task_planning_response_, {
    'Step 14b : Select Operation and Maintenance, Status is 200': (r) => r.status === 200,
    'Step 14b : Response contains "OperationAndMaintenance"': (r) => r.body.includes('OperationAndMaintenance'),
  });
 
  // Log the response for debugging
  console.log('Step 14b : -----> Select Operation and Maintenance:', task_planning_response_.body);
 
  sleep(2); // Pause test
 
  // Step 15 : Select Work order overview
  const requests_url_ = 'https://kommune.mainmanager.is/mmv2/services/MMLayoutReadOnly.asmx/GetMenuItemProcessItems';
 
  // Define the payload as JSON
  const requests_payload_ = JSON.stringify({
    Parent: "OperationAndMaintenance",
    Tag: "Requests"
  });
 
  // Define the headers
  const requests_headers_ = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };
  sleep(2); // Pause test
  // Send POST request
  const requests_response_ = http.post(requests_url_, requests_payload_, { headers: requests_headers_ , timeout: "120s"});
  sleep(2); // Pause test
  // Validate response
  check(requests_response_, {
    'Step 15 : Select Work order overview, Status is 200': (r) => r.status === 200,
    'Step 15 : Response contains "Work orders"': (r) => r.body.includes('Work orders'),
  });
 
  // Log the response for debugging
  console.log('Step 15 : -----> Select Work order overview body:', requests_response_.body);
 
  sleep(2); // Pause test
 
 
  // Step 16 : Click on pin filter
 
  // Constants
 
  const apiUrl = 'https://kommune.mainmanager.is/mmv2/restapi/List/GetMMList';
 
  // Headers for the API request
  const buildingArchiveHeaders = {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
  };
 
  //Click on "API Endpoint"
  sleep(2); // Pause test
  const apiResponse = http.post(apiUrl, null, { headers: buildingArchiveHeaders , timeout: "120s"});
  sleep(2); // Pause test
 
  // Check if the response contains the text "ShowBIM" and status is 200
  check(apiResponse, {
      'STEP 16: API response status is 200': (res) => res.status === 200,
     
  });
 
  // Log the response for debugging
  console.log('Step 16 : -----> Select Work order overview body:', requests_response_.body);
 
  sleep(2); // Pause test
 
 
  // Step 17 : Word order status : Select All
  // Constants
  const apiUrl_ = 'https://kommune.mainmanager.is/mmv2/services/MMLayout.asmx/RefreshDataFilter';
 
  // Headers for the API request
  const buildingArchiveHeaders_ = {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
  };
 
  //  Define the payload as JSON
  const payload_ = JSON.stringify({
      DataTag: "Request",
      ControlIDChanged: "DataFilter_TFStatus",
      TemplateID: 0,
      Value: [
          "DataFilter_TFSearchText#",
          "DataFilter_TFDateFilterID#1000",
          "DataFilter_TFTimeLimitINPUT#All years",
          "DataFilter_TFTimeLimit#;",
          "DataFilter_TFMainTypeID#0",
          "DataFilter_TFAssignmentCategoryID#0",
          "DataFilter_TFFinanceDataSetID#0",
          "DataFilter_TFAccountID#0",
          "DataFilter_TFMaintenanceCategoryID#0",
          "DataFilter_TFCategoryID#0",
          "DataFilter_TFOrganisationFromID#0",
          "DataFilter_TFOwnerID#0",
          "DataFilter_TFOrganisationToID#0",
          "DataFilter_TFEmployeeToID#0",
          "DataFilter_TFFinishBehindSchedule#false",
          "DataFilter_TFStatus#5,2,1,14"
      ]
  });
 
  sleep(2); // Pause test
  const apiResponse_ = http.post(apiUrl_, payload_, { headers: buildingArchiveHeaders_, timeout: "120s" });
  sleep(4); // Pause test
 
  // Check if the response contains the text "ControlID" and status is 200
  check(apiResponse_, {
      'STEP 17: API response status is 200': (res) => res.status === 200,
      'STEP 17: API response contains ControlID': (res) => res.body.includes('ControlID'),
  });
 
  sleep(2); // Pause test
 
 
  // Step 18 : Word order status : Deselet All
 
  // Constants
  const apiUrl__ = 'https://kommune.mainmanager.is/mmv2/restapi/List/GetMMList';
 
  // Headers for the API request
  const buildingArchiveHeaders__  = {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
  };
 
  // Click on "API Endpoint"
  sleep(2); // Pause test
  const apiResponse__  = http.post(apiUrl__ , null, { headers: buildingArchiveHeaders__ , timeout: "120s" });
  sleep(2); // Pause test
 
  // Check if the response contains the text "ShowBIM" and status is 200
  check(apiResponse, {
      'STEP 18: API response status is 200': (res) => res.status === 200,
      'STEP 18: API response contains ControlID': (res) => res.body.includes('recordsTotal'),
     
  });
 
  // Log the response for debugging
  console.log('Step 18 : -----> Select Work order overview body:', requests_response_.body);
 
 
  sleep(2); // Pause test
 
  // Step 19 : Clear filter
  // Constants
  const apiUrl___ = 'https://kommune.mainmanager.is/mmv2/services/MMLayout.asmx/EmptyDataFilter';
 
  // Headers for the API request
  const buildingArchiveHeaders___  = {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
  };
 
  // payload
  const payload___  = JSON.stringify({
      DataTag: "Request",
      Value: [
          "DataFilter_TFSearchText#",
          "DataFilter_TFDateFilterID#1000",
          "DataFilter_TFTimeLimitINPUT#All years",
          "DataFilter_TFTimeLimit#;",
          "DataFilter_TFMainTypeID#0",
          "DataFilter_TFAssignmentCategoryID#0",
          "DataFilter_TFFinanceDataSetID#0",
          "DataFilter_TFAccountID#0",
          "DataFilter_TFMaintenanceCategoryID#0",
          "DataFilter_TFCategoryID#0",
          "DataFilter_TFOrganisationFromID#0",
          "DataFilter_TFOwnerID#0",
          "DataFilter_TFOrganisationToID#0",
          "DataFilter_TFEmployeeToID#0",
          "DataFilter_TFFinishBehindSchedule#false",
          "DataFilter_TFStatus#"
      ]
  });
 
  sleep(2); // Pause test
  const apiResponse___  = http.post(apiUrl___ , payload___ , { headers: buildingArchiveHeaders___ , timeout: "120s" });
  sleep(4); // Pause test
 
  // Check if the response contains the text "FormRefresh" and status is 200
  check(apiResponse___ , {
      'STEP 19: API response status is 200': (res) => res.status === 200,
      'STEP 19: API response contains FormRefresh': (res) => res.body.includes('FormRefresh'),
  });
 
  sleep(2); // Pause test
 
            // STEP 20: Logout Request
    const logoutUrl = 'https://kommune.mainmanager.is/mmv2/MMV2Logout.aspx';
 
    const logoutHeaders = {
      'Content-Type': 'text/html; charset=utf-8',
      //'Cookie': cookieHeader,
    };
 
    sleep(2); // Pause test
    const logoutResponse = http.get(logoutUrl, { headers: logoutHeaders ,  timeout: "120s"});
    sleep(2); // Pause test
 
    check(logoutResponse, {
      'STEP 20 : Logout Request, Status is 200': (r) => r.status === 200,
      'STEP 20 : Content-Type is HTML': (r) => r.headers['Content-Type'] === 'text/html; charset=utf-8',
      'STEP 20 : Server is Cloudflare': (r) => r.headers['Server'] === 'cloudflare',
    });
  }