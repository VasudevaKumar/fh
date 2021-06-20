import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../fh/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  env = environment;

  getEmployeeHomDetails(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getEmployeeHomDetails';
    
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  getPeopleWhoMayKnow(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getPeopleWhoMayKnow';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  getEmployeeHomePics(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getEmployeeHomePics';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  uploadHomePageFileL(formData:any)
  {     
    const api = this.env.apiBaseURL+'/uploadHomePageFileL';
    return this.http.post(
        api,
        formData,
        ).pipe(map((data: any) => data.data));
  }

  uploadHomePageFileR(formData:any)
  {     
    const api = this.env.apiBaseURL+'/uploadHomePageFileR';
    return this.http.post(
        api,
        formData,
        ).pipe(map((data: any) => data.data));
  }

  getPosts(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getPosts';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  getMyPosts(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getMyPosts';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  getIntervalPosts(employeeID:any, lastPostDate:any)
  {
    const api = this.env.apiBaseURL+'/getIntervalPosts';
    return this.http.post(
        api,
        {employeeID:employeeID, lastPostDate:lastPostDate},
        ).pipe(map((data: any) => data.data));
  }

  
  pushComments(employeeID:any , postID:any, commentNotes:any)
  {
    const api = this.env.apiBaseURL+'/pushComments';
    return this.http.post(
        api,
        {
            employeeID:employeeID,
            postID:postID,
            commentNotes:commentNotes
        },
        ).pipe(map((data: any) => data.data));
  }

  pushPost(employeeID:any , commentNotes:any)
  {
    const api = this.env.apiBaseURL+'/pushPost';
    return this.http.post(
        api,
        {
            employeeID:employeeID,
            commentNotes:commentNotes
        },
        ).pipe(map((data: any) => data.data));
  }

  postImage(formData:any)
  {     
    const api = this.env.apiBaseURL+'/postImage';
    return this.http.post(
        api,
        formData,
        ).pipe(map((data: any) => data.data));
  }

  postSharing(postID: any , employeeID:any)
  {
    const api = this.env.apiBaseURL+'/postSharing';
    return this.http.post(
        api,
        {
            employeeID:employeeID,
            postID:postID
        },
        ).pipe(map((data: any) => data.data));
  }

  postLike(postID: any , employeeID:any)
  {
    const api = this.env.apiBaseURL+'/postLike';
    return this.http.post(
        api,
        {
            employeeID:employeeID,
            postID:postID
        },
        ).pipe(map((data: any) => data.data));
  }
  getConnectPageInfo(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getConnectPageInfo';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }
  
  getConnectPeople(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getConnectPeople';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  gettotalConnects(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/gettotalConnects';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  gettotalGroups(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/gettotalGroups';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }


  connectme(user_id: any , employeeID:any)
  {
    const api = this.env.apiBaseURL+'/connectme';
    return this.http.post(
        api,
        {
            employeeID:employeeID,
            connect_id:user_id
        },
        ).pipe(map((data: any) => data.data));
  }

  followMe(user_id: any , employeeID:any)
  {
    const api = this.env.apiBaseURL+'/followMe';
    return this.http.post(
        api,
        {
            employeeID:employeeID,
            follower_id:user_id
        },
        ).pipe(map((data: any) => data.data));
  }


  getPendingRequests(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getPendingRequests';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  getApprovedNotifications(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getApprovedNotifications';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }


  acceptRequest(connectID:any)
  {
    const api = this.env.apiBaseURL+'/acceptRequest';
    return this.http.post(
        api,
        {connectID:connectID},
        ).pipe(map((data: any) => data.data));
  }


  addGroup(formData:any)
  {     
    const api = this.env.apiBaseURL+'/addGroup';
    return this.http.post(
        api,
        formData,
        ).pipe(map((data: any) => data));
  }

  addHashTag(formData:any)
  {     
    const api = this.env.apiBaseURL+'/addHashTag';
    return this.http.post(
        api,
        formData,
        ).pipe(map((data: any) => data));
  }


  addMeToGroup(group_id: any , employeeID:any)
  {
    const api = this.env.apiBaseURL+'/addMeToGroup';
    return this.http.post(
        api,
        {
            employeeID:employeeID,
            group_id:group_id
        },
        ).pipe(map((data: any) => data.data));
  }

  verifyHashTag(hashTagValue:any)
  {
    const api = this.env.apiBaseURL+'/verifyHashTag';
    return this.http.post(
        api,
        {hashTagValue:hashTagValue},
        ).pipe(map((data: any) => data));
  }

  getMyProfileBasicInfo(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getMyProfileBasicInfo';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  getSocialMediaLinks(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getSocialMediaLinks';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }
  getProfilePageInfo(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getProfilePageInfo';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  getPostingPageInfo(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getPostingPageInfo';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  getMyProfileSkillInfo(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getMyProfileSkillInfo';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  getMyProfileExp(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getMyProfileExp';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }
  geViewedCompanyProfiles(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/geViewedCompanyProfiles';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }
  getMyProfileEducation(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getMyProfileEducation';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  deletePost(postID)
  {
    const api = this.env.apiBaseURL+'/deletePost';
    return this.http.post(
        api,
        {postID:postID},
        ).pipe(map((data: any) => data.data));
  }

  getMyConnects(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getMyConnects';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  countUpdate(employeeID:any, viewUserID:any)
  {
    const api = this.env.apiBaseURL+'/countUpdate';
    return this.http.post(
        api,
        {employeeID:employeeID, viewUserID:viewUserID},
        ).pipe(map((data: any) => data.data));
  }

  getNotifications(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getNotifications';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }


  getLatestChatMessages(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getLatestChatMessages';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  getIntervalChatMessages(employeeID:any, lastPostDate:any)
  {
    const api = this.env.apiBaseURL+'/getIntervalChatMessages';
    return this.http.post(
        api,
        {employeeID:employeeID, lastPostDate:lastPostDate},
        ).pipe(map((data: any) => data.data));
  }

  

  getIntervalMessages(employeeID:any, latestSendToId:any, lastPostDate:any)
  {
    const api = this.env.apiBaseURL+'/getIntervalMessages';
    return this.http.post(
        api,
        {employeeID:employeeID,latestSendToId:latestSendToId, lastPostDate:lastPostDate},
        ).pipe(map((data: any) => data.data));
  }


  getAllChatMessages(employeeID:any, latestSendToId:any)
  {
    const api = this.env.apiBaseURL+'/getAllChatMessages';
    return this.http.post(
        api,
        {employeeID:employeeID,latestSendToId:latestSendToId },
        ).pipe(map((data: any) => data.data));
  }

  getPendingChatMessages(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getPendingChatMessages';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }


  submitChatReply(employeeID:any, latestSendToId:any,replyMsg:any)
  {
    const api = this.env.apiBaseURL+'/submitChatReply';
    return this.http.post(
        api,
        {employeeID:employeeID,latestSendToId:latestSendToId,replyMsg:replyMsg },
        ).pipe(map((data: any) => data.data));
  }
  acceptRequestNotification(ID:any, category:any)
  {
    const api = this.env.apiBaseURL+'/acceptRequestNotification';
    return this.http.post(
        api,
        {ID:ID , category:category},
        ).pipe(map((data: any) => data.data));
  }


  acceptApproveRequest(connectID:any)
  {
    const api = this.env.apiBaseURL+'/acceptApproveRequest';
    return this.http.post(
        api,
        {connectID:connectID},
        ).pipe(map((data: any) => data.data));
  }

  profileViews(employeeID:any)
  {     
    const api = this.env.apiBaseURL+'/profileViews';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  postLikes(postID:any)
  {     
    const api = this.env.apiBaseURL+'/displayLikes';
    return this.http.post(
        api,
        {postID:postID},
        ).pipe(map((data: any) => data.data));
  }

  deleteLeftImage(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/deleteLeftImage';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  deleteRightImage(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/deleteRightImage';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  clearPendingChatMessages(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/clearPendingChatMessages';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  updateLogout(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/updateLogout';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data))
  }

  
  myvideo(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/myvideo';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  addVideo(formData:any)
  {     
    const api = this.env.apiBaseURL+'/uploadvideo';
    return this.http.post(
        api,
        formData,
        ).pipe(map((data: any) => data.data));
  }

  sendEmailConfirmation(likeEmplyee:any)
  {
    const api = this.env.apiBaseURL+'/confirmation16PF';
    return this.http.post(
        api,
        {likeEmplyee:likeEmplyee},
        ).pipe(map((data: any) => data.data));
  }


}
