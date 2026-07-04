import GroupController from './GroupController'
import MemberController from './MemberController'
import GroupInviteController from './GroupInviteController'
import EventController from './EventController'
import ExpenseController from './ExpenseController'
import SettlementController from './SettlementController'
import ActivityController from './ActivityController'
import Settings from './Settings'
import OAuthController from './OAuthController'
import Auth from './Auth'
const Controllers = {
    GroupController: Object.assign(GroupController, GroupController),
MemberController: Object.assign(MemberController, MemberController),
GroupInviteController: Object.assign(GroupInviteController, GroupInviteController),
EventController: Object.assign(EventController, EventController),
ExpenseController: Object.assign(ExpenseController, ExpenseController),
SettlementController: Object.assign(SettlementController, SettlementController),
ActivityController: Object.assign(ActivityController, ActivityController),
Settings: Object.assign(Settings, Settings),
OAuthController: Object.assign(OAuthController, OAuthController),
Auth: Object.assign(Auth, Auth),
}

export default Controllers