<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Example
 *
 * This is an example of a few basic user interaction methods you could use
 * all done with a hardcoded array.
 *
 * @package		CodeIgniter
 * @subpackage	Rest Server
 * @category	Controller
 * @author		Phil Sturgeon
 * @link		http://philsturgeon.co.uk/code/
*/

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH.'/libraries/REST_Controller.php';

class Services extends REST_Controller
{
	function __construct()
    {
        // Construct our parent class
        parent::__construct();
        $this->load->model('Auth_model', 'Auth');
        
        // Configure limits on our controller methods. Ensure
        // you have created the 'limits' table and enabled 'limits'
        // within application/config/rest.php
        $this->methods['user_get']['limit'] = 500; //500 requests per hour per user/key
        $this->methods['user_post']['limit'] = 100; //100 requests per hour per user/key
        $this->methods['user_delete']['limit'] = 50; //50 requests per hour per user/key
        $this->load->helper(array('form', 'url'));
        $this->load->library('session');
         $this->load->library('email');
        $this->load->model('Model');
    }



    function uploadCarPic_post(){
        $this->load->helper('form');


            $userId=$this->post('userid');

            $config['overwrite'] = TRUE;
            $config['allowed_types'] = 'jpg|jpeg|gif|png';
            $config['max_size'] = 2000;
            $config['upload_path'] = '../app/assets/images/upload/';

            $this->load->library('upload', $config);
            $this->upload->do_upload('file');
            $image_data = $this->upload->data();
            $updateCarPic = $this->Model->updateCarPic($image_data['file_name'],$userId);
            $this->response($image_data, 200); // 200 being the HTTP response code
    }

    //service calls starts here
      function offerRides_post()
        {
          $data = array(
                         'departure' => $this->post('departureField'),
                                                'arrival' => $this->post('arrivalField') ,
                                                'departure_date' => $this->post('dt'),
                                                 'departure_time' => $this->post('mytime'),
                                                 'price' =>  $this->post('price'),
                                                 'seats' =>  $this->post('seats'),
                                                 'further_details' =>  $this->post('futureDetails'),
                                                 'luggage_size' => $this->post('luggage'),
                                                 'leave' =>  $this->post('leave'),
                                                 'detour' => $this->post('detour'),
                                                 'userid' =>$this->post('userid'),
                                                 'created_date' =>date('Y-m-d H:i:s'),
                                                 'user_type'=>$this->post('userType')
                     );
            $offerRide = $this->Model->saveOfferRide($data);
            $this->response($offerRide, 200); // 200 being the HTTP response code
        }

     function updateride_post(){
      $data = array(
                             'departure' => $this->post('departure'),
                             'arrival' => $this->post('arrival') ,
                             'departure_date' => $this->post('departure_date'),
                              'departure_time' => $this->post('departure_time'),
                              'price' =>  $this->post('price'),
                              'seats' =>  $this->post('seats'),
                              'further_details' =>  $this->post('further_details'),
                              'luggage_size' => $this->post('luggage_size'),
                              'leave' =>  $this->post('leave'),
                              'detour' => $this->post('detour'),

                              'created_date' =>date('Y-m-d H:i:s'),
                              'user_type'=>"facebook"
                          );
                 $updateRide = $this->Model->updateRide($data,$this->get('ride'));
                 $this->response($updateRide, 200); // 200 being the HTTP response code

     }

     function getRides_get(){

             $departure=$this->get('origin');
             $arrival = $this->get('destination');

         $rides = $this->Model->getRides($departure,$arrival);
         $this->response($rides, 200); // 200 being the HTTP response code
     }


     function filterRides_get(){

                    $departure=$this->get('origin');
                    $arrival = $this->get('destination');
                    $maxPrice = $this->get('maxPrice');
                    $minPrice = $this->get('minPrice');
                    $date = $this->get('date');
                    $rides = $this->Model->filterRides($departure,$arrival,$maxPrice,$minPrice,$date);
                    $this->response($rides, 200); // 200 being the HTTP response code
     }

      function getRideDetails_get(){
              $data=array(
                  'id'=>$this->get('id')
              );
              $rideDetails = $this->Model->getRideDetails($data);
              $this->response($rideDetails, 200); // 200 being the HTTP response code
          }
      function getRidesByUser_get(){
                      $data=array(
                           'userid'=>$this->get('id')
                       );
                       $userRideDetails = $this->Model->getUserRide($data);
                       $this->response($userRideDetails, 200); // 200 being the HTTP response code
      }

      function getRideById_get(){
                               $RideDetails = $this->Model->getRideById($this->get('id'));
                               $this->response($RideDetails, 200); // 200 being the HTTP response code
      }

      function deleteRidesByUser_get(){
         $userDeleteRide = $this->Model->deleteUserRide($this->get('id'),$this->get('rideId'));
         $this->response($this->get('rideId'), 200); // 200 being the HTTP response code
      }

      function deleteCarByUser_get(){
           $userDeleteCar = $this->Model->deleteUserCar($this->get('id'),$this->get('carId'));
           $this->response($this->get('carId'), 200); // 200 being the HTTP response code
      }


      function storeMobileData_post(){
            //Your authentication key
            $authKey = "3023AjxGwLIXh16557bdc85";

            //Multiple mobiles numbers separated by comma
            $mobileNumber = $this->post('mobile');

            //Sender ID,While using route4 sender id should be 6 characters long.
            $senderId = "WEBSMS";

            //Your message to send, Add URL encoding here.
            $message = urlencode("Your verification code for sharerides is: " .$this->post('code'));

            //Define route 
            $route = "default";
            //Prepare you post parameters
            $postData = array(
                'authkey' => $authKey,
                'mobiles' => $mobileNumber,
                'message' => $message,
                'sender' => $senderId,
                'route' => $route
            );

            //API URL
            $url="http://sms.ssdindia.com/sendhttp.php";

            // init the resource
            $ch = curl_init();
            curl_setopt_array($ch, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $postData
                //,CURLOPT_FOLLOWLOCATION => true
            ));


            //Ignore SSL certificate verification
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);


            //get response
            $output = curl_exec($ch);

            //Print error if any
            if(curl_errno($ch))
            {
                echo 'error:' . curl_error($ch);
            }

            curl_close($ch);

            

            $mobileVerifyCode = $this->Model->updateMobileData($this->post('id'),$this->post('userType'),$this->post('mobile'),$this->post('code'));
            $this->response($mobileVerifyCode, 200); // 200 being the HTTP response code
      }


    function facebookUserSignUp_post(){
            $data=array(
                 'social_id'=> $this->post('social_id'),
                  'logintype'=>'facebook',
                 'first_name'=>$this->post('first_name'),
                 'last_name'=>$this->post('last_name'),
                  'gender'=>$this->post('gender'),
                  'email_id'=>$this->post('email_id'),

              );
            $checkUser=$this->Model->checkUser($this->post('social_id'));
            if(!$checkUser){
               $saveDetails = $this->Model->saveFbUserDetails($data);
            }else{
               $saveDetails="facebook user registed already";
            }

          $this->response($data, 200); // 200 being the HTTP response code
    }


     function storeUsersIdSession_post(){
            $user_data=array(
                'uid'=>$this->post('ID')
            );
            $this->session->set_userdata($user_data);
            $this->response($this->session->all_userdata(), 200); // 200 being the HTTP response code
     }

     function destorySession_get(){
         if($this->session->sess_destroy()){
             $this->response('session destroyed', 200); // 200 being the HTTP response code
         }

     }

     function getUserDetails_get(){
     if($this->get('uType')=='facebook'){
         $searchRow='social_id';
     }else{
        $searchRow='user_id';
     }
         $data=array(
             $searchRow=>$this->get('id')
         );
         $userDetails = $this->Model->getUserDetails($data);
         $this->response($userDetails, 200); // 200 being the HTTP response code
     }


     function confirmCode_get(){

                  $confirmCode = $this->Model->confirmMobileCode($this->get('id'),$this->get('mobile'),$this->get('code'),$this->get('userType'));
                  $this->response($confirmCode, 200); // 200 being the HTTP response code
     }


    
    function user_get() {
        $email = $this->get('username');
        $pass = $this->get('password');
        if ($email && $pass) {
            $data = $this->Auth->loginUser($email, $pass);
            if ($data) {
                $this->response($data, 200); 
            } else {
                $this->response(array('error' => 'Invalid Username/Password'), 200);
            }
        } else {
            $this->response(array('error' => 'User could not be found'), 404);
        }
    }

    function sendMessage_post(){
       $message_data=array(
                       'sender_id'=>$this->post('sender'),
                       'reciver_id'=>$this->post('reciver'),
                       'message'=>$this->post('message'),
                       'status'=>1
                );
        $message=$this->Model->sendMessage($message_data);
        $this->response($message, 200); // 200 being the HTTP response code
    }

    function getMessageDetail_get(){
             $messageDetails = $this->Model->getMessageDetails($this->get('id'),$this->get('userType'));
             $this->response($messageDetails, 200); // 200 being the HTTP response code
    }

    function getMessageCount_get(){
              $messageCount = $this->Model->getMessageCount($this->get('id'),$this->get('userType'));
                 $this->response($messageCount, 200); // 200 being the HTTP response code
    }

    
    function userSignUp_post()
    {

        $fname = $this->post('fname');
        $lname = $this->post('lname');
        $email = $this->post('email');
        $mobile = $this->post('mobile');
        $gender = $this->post('gender');
        $password = $this->post('password');

        $data = array('first_name' => $fname, 'last_name' => $lname, 'email_id' => $email, 'mobile_number' => $mobile, 'gender' => $gender, 'password' => $this->create_password($password), 'last_login_time' => date('Y-m-d H:i:s'));
        $insertID = $this->Auth->insertUser($data,$email,$mobile);
        if ($insertID && $insertID != 0) {

            //send a mail to user to notification
            $subject = 'Sharerides Registration';
            

            // Get full html:
            $body =
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <title>'.htmlspecialchars($subject, ENT_QUOTES, $this->email->charset).'</title>
                <style type="text/css">
                    body {
                        font-family: Arial, Verdana, Helvetica, sans-serif;
                        font-size: 16px;
                    }
                </style>
            </head>
            <body>
             <div>
                    <p>Dear <b>'.$fname.' '.$lname.'</b>,</p>
                    <p>Congratulations! Your Share rides account is almost ready, but before you can login you need to complete a brief account verification process.</p>
                    <p><a href="#">Click here</a> to verify your email ID.<p>
                    <p>For security reasons, this link will be active for 24 hrs.</p>
                    <p>On successfully completing this verification, your Share rides  account will be activated.</p>
                    <p>&nbsp;</p>
                    <p>In case you fail to complete your account verification process within 24 hrs. Please contact share rides admin</p>
                 
                     <table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody>
                     <tr>
                      <td width="74%" align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#373737;border-top:solid 1px #e4e6eb">
                      <strong><br>SHARERIDES CUSTOMER CARE<br></strong> 
                      Phone: +91 - 9035323621<br>
                      Email: <a href="mailto:sharerides@gmail.com" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#373737;text-decoration:underline" target="_blank">contact@sharerides.com</a><br>
                      Website: <a href="http://www.sharerides.in/" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#373737;text-decoration:underline" target="_blank">www.sharerides.in</a>
                      </td>

                      <td width="26%" align="right" valign="bottom">
                        <img src="" width="109" height="31" border="0" class="CToWUd">
                        </td>
                        </tr>
                        </tbody>
                        </table>


             </div>
            </body>
            </html>';
            // Also, for getting full html you may use the following internal method:
            //$body = $this->email->full_html($subject, $message);

            $result = $this->email
                ->from('sharerides@gmail.com')
                ->reply_to('yoursecondemail@somedomain.com')    // Optional, an account where a human being reads.
                ->to('msnjsk@gmail.com')
                ->subject($subject)
                ->message($body)
                ->send();



            $message = array('userid' => $insertID,'message' => 'User has added successfully', 'status' => 'success');
            $this->response($message, 200); 
        }elseif($insertID == 0){
            $this->response(array('error' => 'Already username has taken'), 200);
        }else {
            $this->response(array('error' => 'User could not be found'), 404);
        }
    }
    
    
    function carAllModels_get() {
        $value = $this->Model->getAllCarList();
        $carAllModel = array();
        if(!empty($value)){
            foreach ($value as $allModel){                
                array_push($carAllModel, $allModel);
            }
        }       
        $this->response($carAllModel, 200); 
    }
    
    function saveCar_post(){
         $car_data=array(
                'user_id'=>$this->post('userID'),
                'car_make_id'=>$this->post('makeModelOpt'),
                'car_model_id'=>$this->post('modelOpt'),
                'car_comfort'=>$this->post('comfort'),
                'car_color'=>$this->post('color')
         );
         $carDetail=$this->Model->set_carData($car_data);
         $this->response($carDetail, 200); // 200 being the HTTP response code
        
    }
    
    function getUserCarDetails_get(){
        
        $carDetails = $this->Model->getUserCarDetail($this->get('id'));
        $this->response($carDetails, 200); // 200 being the HTTP response code
    }
    
    
    function user_delete()
    {
    	//$this->some_model->deletesomething( $this->get('id') );
        $message = array('id' => $this->get('id'), 'message' => 'DELETED!');
        
        $this->response($message, 200); // 200 being the HTTP response code
    }
    
    function users_get()
    {
        //$users = $this->some_model->getSomething( $this->get('limit') );
        $users = array(
			array('id' => 1, 'name' => 'Some Guy', 'email' => 'example1@example.com'),
			array('id' => 2, 'name' => 'Person Face', 'email' => 'example2@example.com'),
			3 => array('id' => 3, 'name' => 'Scotty', 'email' => 'example3@example.com', 'fact' => array('hobbies' => array('fartings', 'bikes'))),
		);
        
        if($users)
        {
            $this->response($users, 200); // 200 being the HTTP response code
        }

        else
        {
            $this->response(array('error' => 'Couldn\'t find any users!'), 404);
        }
    }


	public function send_post()
	{
		var_dump($this->request->body);
	}


	public function send_put()
	{
		var_dump($this->put('foo'));
	}
        
    /**
     * Password Functionality   
     */

    private static $algo = '$2a';
    private static $cost = '$10';

    public static function unique_salt() {
        return substr(sha1(mt_rand()), 0, 22);
    }

    public static function create_password($password) {

        return crypt($password, self::$algo .
                self::$cost .
                '$' . self::unique_salt());
    }

    /**
     * End Password Functionality  
     */
}