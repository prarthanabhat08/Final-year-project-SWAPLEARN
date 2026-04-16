from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User, Skill, UserSkill, UserFullData, SkillRequest
import json


def home(request):
    return render(request, 'add.html')


@csrf_exempt
def register(request):
    if request.method == "POST":
        User.objects.create(
            full_name=request.POST.get("name"),
            username=request.POST.get("username"),
            email=request.POST.get("email"),
            password=request.POST.get("password")
        )
        return render(request, 'success.html')

    return JsonResponse({"error": "POST required"}, status=400)


@csrf_exempt
def api_add_user(request):
    if request.method == "POST":
        data = json.loads(request.body)

        user = User.objects.create(
            full_name=data.get("name"),
            username=data.get("name"),
            email=data.get("email"),
            password=data.get("password")
        )

        return JsonResponse({"id": user.user_id})

    return JsonResponse({"error": "POST required"}, status=400)


def api_get_users(request):
    users = User.objects.all()
    return JsonResponse([
        {"id": u.user_id, "name": u.full_name, "email": u.email}
        for u in users
    ], safe=False)


@csrf_exempt
def api_login(request):
    if request.method == "POST":
        data = json.loads(request.body)

        user = User.objects.filter(
            username=data.get("username"),
            password=data.get("password")
        ).first()

        if user:
            return JsonResponse({
                "status": "success",
                "user_id": user.user_id,
                "name": user.full_name
            })

        return JsonResponse({"status": "error"})

    return JsonResponse({"error": "POST only"}, status=400)


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

        UserFullData.objects.create(
            user=user,
            username=user.username,
            full_name=user.full_name,
            email=user.email,
            password=user.password,
            teach_skills=data.get("teach_skills", []),
            learn_skills=data.get("learn_skills", [])
        )

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
def send_request(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            sender = User.objects.get(user_id=data.get("sender_id"))
            receiver = User.objects.get(user_id=data.get("receiver_id"))

            skill = Skill.objects.filter(
                skill_name=data.get("skill"),
                language=data.get("language")
            ).first()

            if not skill:
                return JsonResponse({"error": "Skill not found"}, status=400)

            SkillRequest.objects.create(
                sender=sender,
                receiver=receiver,
                skill=skill,
                status="pending"
            )

            return JsonResponse({"message": "Request sent"})

        except Exception as e:
            print("ERROR:", e)
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "POST only"}, status=400)

def get_requests(request, user_id):
    reqs = SkillRequest.objects.filter(receiver__user_id=user_id)

    data = []

    for r in reqs:
        data.append({
            "request_id": r.request_id,
            "sender_name": r.sender.full_name,
            "skill": r.skill.skill_name,
            "status": r.status
        })

    return JsonResponse(data, safe=False)


@csrf_exempt
def accept_request(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            req = SkillRequest.objects.get(request_id=data.get("request_id"))
            req.status = "accepted"
            req.save()

            return JsonResponse({"message": "Request accepted"})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "POST only"}, status=400)


@csrf_exempt
def reject_request(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            req = SkillRequest.objects.get(request_id=data.get("request_id"))
            req.status = "rejected"
            req.save()

            return JsonResponse({"message": "Request rejected"})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "POST only"}, status=400)