from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User, Skill, UserSkill, UserFullData, SkillRequest, ChatRoom, Message
import json
import hashlib
import os
print("RUNNING FROM:", os.getcwd())
print("CORRECT VIEWS.PY RUNNING ")   


def home(request):
    return render(request, 'add.html')


# ================= REGISTER =================
@csrf_exempt
def register(request):
    if request.method == "POST":
        raw_password = request.POST.get("password")
        hashed_password = hashlib.sha256(raw_password.encode()).hexdigest()

        User.objects.create(
            full_name=request.POST.get("name"),
            username=request.POST.get("username"),
            email=request.POST.get("email"),
            password=hashed_password
        )
        return render(request, 'success.html')

    return JsonResponse({"error": "POST required"}, status=400)


@csrf_exempt
def api_add_user(request):
    if request.method == "POST":
        data = json.loads(request.body)

        hashed_password = hashlib.sha256(data.get("password").encode()).hexdigest()

        user = User.objects.create(
            full_name=data.get("name"),
            username=data.get("username"),
            email=data.get("email"),
            password=hashed_password
        )

        return JsonResponse({"id": user.user_id})

    return JsonResponse({"error": "POST required"}, status=400)


# ================= LOGIN =================
@csrf_exempt
def api_login(request):
    if request.method == "POST":
        data = json.loads(request.body)

        hashed_password = hashlib.sha256(data.get("password").encode()).hexdigest()

        user = User.objects.filter(
            username=data.get("username"),
            password=hashed_password
        ).first()

        if user:
            return JsonResponse({
                "status": "success",
                "user_id": user.user_id,
                "name": user.full_name
            })

        return JsonResponse({"status": "error"})

    return JsonResponse({"error": "POST only"}, status=400)


# ================= REQUEST =================
def api_get_users(request):
    users = User.objects.all()

    return JsonResponse([
        {
            "user_id": u.user_id,
            "name": u.full_name,
            "email": u.email
        }
        for u in users
    ], safe=False)


@csrf_exempt
def send_request(request):
    if request.method == "POST":
        data = json.loads(request.body)

        sender = User.objects.get(user_id=data.get("sender_id"))
        receiver = User.objects.get(user_id=data.get("receiver_id"))

        skill = Skill.objects.filter(
            skill_name=data.get("skill"),
            language=data.get("language")
        ).first()

        SkillRequest.objects.create(
            sender=sender,
            receiver=receiver,
            skill=skill,
            status="pending"
        )

        return JsonResponse({"message": "Request sent"})

    return JsonResponse({"error": "POST only"}, status=400)


def get_requests(request, user_id):
    reqs = SkillRequest.objects.filter(receiver__user_id=user_id)

    return JsonResponse([
        {
            "request_id": r.request_id,
            "sender_name": r.sender.full_name,
            "skill": r.skill.skill_name,
            "status": r.status
        }
        for r in reqs
    ], safe=False)


# ================= ACCEPT REQUEST =================
@csrf_exempt
def accept_request(request):
    if request.method == "POST":
        data = json.loads(request.body)

        req = SkillRequest.objects.get(request_id=data.get("request_id"))
        req.status = "accepted"
        req.save()

        sender = req.sender
        receiver = req.receiver

        existing_room = ChatRoom.objects.filter(
            users=sender
        ).filter(
            users=receiver
        ).first()

        if not existing_room:
            room = ChatRoom()
            room.save()

            room.users.add(sender)
            room.users.add(receiver)

            print("🔥 NEW ROOM CREATED:", room.id)   # ✅ DEBUG

        return JsonResponse({"message": "Request accepted + chat room created"})

    return JsonResponse({"error": "POST only"}, status=400)


# ================= CHAT LIST =================
def get_chats(request, user_id):
    try:
        data = []

        rooms = ChatRoom.objects.all()

        for room in rooms:

            print("ROOM ID:", room.id)   # ✅ DEBUG

            users = room.users.all()
            user_ids = [u.user_id for u in users]

            if int(user_id) not in user_ids:
                continue

            other_user = None
            for u in users:
                if u.user_id != int(user_id):
                    other_user = u
                    break

            data.append({
                "room_id": room.id,   # ✅ INTEGER FIXED
                "name": other_user.full_name if other_user else "User",
                "last_message": ""
            })

        print("FINAL CHAT DATA:", data)   # ✅ DEBUG

        return JsonResponse(data, safe=False)

    except Exception as e:
        print("ERROR:", e)
        return JsonResponse({"error": str(e)}, status=500)


# ================= LOAD MESSAGES =================
def get_messages(request, room_id):
    print("🔥 FETCHING MESSAGES FOR ROOM:", room_id)  # ✅ DEBUG

    msgs = Message.objects.filter(room__id=room_id)

    return JsonResponse([
        {
            "sender": m.sender.user_id,
            "text": m.text
        }
        for m in msgs
    ], safe=False)


# ================= SEND MESSAGE =================
@csrf_exempt
def send_message(request):
    if request.method == "POST":
        data = json.loads(request.body)

        sender = User.objects.get(user_id=data.get("sender_id"))
        room = ChatRoom.objects.get(id=data.get("room_id"))

        print("🔥 SENDING MESSAGE TO ROOM:", room.id)  # ✅ DEBUG

        Message.objects.create(
            sender=sender,
            room=room,
            text=data.get("text")
        )

        return JsonResponse({"message": "Message sent"})

    return JsonResponse({"error": "POST only"}, status=400)


# ================= SKILLS =================
@csrf_exempt
def save_user_skills(request):
    if request.method == "POST":
        data = json.loads(request.body)

        user = User.objects.get(user_id=data.get("user_id"))

        for s in data.get("teach_skills", []):
            skill, _ = Skill.objects.get_or_create(
                skill_name=s["skill"],
                category=s.get("category", "General"),
                language=s["language"]
            )
            UserSkill.objects.get_or_create(user=user, skill=skill, skill_type="teach")

        for s in data.get("learn_skills", []):
            skill, _ = Skill.objects.get_or_create(
                skill_name=s["skill"],
                category=s.get("category", "General"),
                language=s["language"]
            )
            UserSkill.objects.get_or_create(user=user, skill=skill, skill_type="learn")

        return JsonResponse({"message": "Saved"})

    return JsonResponse({"error": "POST only"}, status=400)


def get_user_skills(request, user_id):
    skills = UserSkill.objects.filter(user__user_id=user_id)

    return JsonResponse([
        {
            "skill_name": s.skill.skill_name,
            "category": s.skill.category,
            "language": s.skill.language,
            "type": s.skill_type
        }
        for s in skills
    ], safe=False)


def find_matches(request, user_id):
    user = User.objects.get(user_id=user_id)

    learn_skills = UserSkill.objects.filter(user=user, skill_type="learn")

    matches = []

    for ls in learn_skills:
        teachers = UserSkill.objects.filter(
            skill=ls.skill,
            skill_type="teach"
        ).exclude(user=user)

        for t in teachers:
            matches.append({
                "user_id": t.user.user_id,
                "name": t.user.full_name,
                "skill": ls.skill.skill_name,
                "language": ls.skill.language
            })

    return JsonResponse(matches, safe=False)


@csrf_exempt
def reject_request(request):
    if request.method == "POST":
        data = json.loads(request.body)

        req = SkillRequest.objects.get(request_id=data.get("request_id"))
        req.status = "rejected"
        req.save()

        return JsonResponse({"message": "Request rejected"})

    return JsonResponse({"error": "POST only"}, status=400)


def discover_users(request, user_id):
    users = User.objects.exclude(user_id=user_id)

    result = []

    for u in users:
        teach = UserSkill.objects.filter(user=u, skill_type="teach")
        learn = UserSkill.objects.filter(user=u, skill_type="learn")

        result.append({
            "user_id": u.user_id,
            "name": u.full_name,
            "teach": [t.skill.skill_name for t in teach],
            "learn": [l.skill.skill_name for l in learn],
        })

    return JsonResponse(result, safe=False)
