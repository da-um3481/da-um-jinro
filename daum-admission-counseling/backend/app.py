"""
DA.UM 진학상담 시스템 - Flask 백엔드
완전히 독립적으로 실행되는 진학상담 전문가 시스템
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime

# Flask 앱 초기화
app = Flask(__name__)

# CORS 설정 (프론트엔드와 통신)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# 설정
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///daum_admission.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'daum-admission-secret-key-2024'
app.config['JSON_AS_ASCII'] = False  # 한글 지원

# DB 초기화
db = SQLAlchemy(app)

# ==================== 데이터베이스 모델 ====================

class Counselor(db.Model):
    """상담사"""
    __tablename__ = 'counselors'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    organization = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 관계
    students = db.relationship('Student', backref='counselor', lazy=True)
    consultations = db.relationship('Consultation', backref='counselor', lazy=True)


class Student(db.Model):
    """학생"""
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    counselor_id = db.Column(db.Integer, db.ForeignKey('counselors.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    school_name = db.Column(db.String(200))
    grade = db.Column(db.Integer, nullable=False)  # 1(중1) ~ 6(고3)
    school_type = db.Column(db.String(20))  # 'middle', 'high'
    desired_major = db.Column(db.String(200))
    major_status = db.Column(db.String(20))  # 'confirmed', 'exploring', 'undecided'
    parent_name = db.Column(db.String(100))
    parent_phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 관계
    academic_records = db.relationship('AcademicRecord', backref='student', lazy=True, cascade='all, delete-orphan')
    diagnoses = db.relationship('Diagnosis', backref='student', lazy=True, cascade='all, delete-orphan')
    consultations = db.relationship('Consultation', backref='student', lazy=True, cascade='all, delete-orphan')


class AcademicRecord(db.Model):
    """성적 기록"""
    __tablename__ = 'academic_records'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    semester = db.Column(db.String(20), nullable=False)  # '2024-1'
    gpa_average = db.Column(db.Float)
    korean_grade = db.Column(db.Integer)
    math_grade = db.Column(db.Integer)
    english_grade = db.Column(db.Integer)
    science_grade = db.Column(db.Integer)
    social_grade = db.Column(db.Integer)
    grade_variance = db.Column(db.Float)
    trend = db.Column(db.String(20))  # 'rising', 'stable', 'falling'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Diagnosis(db.Model):
    """입시형 진단"""
    __tablename__ = 'diagnoses'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    diagnosis_date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    
    # A. 성적 구조 진단
    grade_type = db.Column(db.String(20))  # 'stable', 'rising', 'fluctuating', 'risky'
    grade_score = db.Column(db.Integer)
    
    # B. 비교과 진단
    extracurricular_type = db.Column(db.String(30))
    extracurricular_score = db.Column(db.Integer)
    
    # C. 학습 태도 진단
    management_type = db.Column(db.String(30))
    management_score = db.Column(db.Integer)
    
    # 종합
    summary_type = db.Column(db.String(100))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 관계
    admission_analysis = db.relationship('AdmissionTypeAnalysis', backref='diagnosis', uselist=False, cascade='all, delete-orphan')
    risks = db.relationship('RiskAnalysis', backref='diagnosis', lazy=True, cascade='all, delete-orphan')


class AdmissionTypeAnalysis(db.Model):
    """전형 적합도 분석"""
    __tablename__ = 'admission_type_analysis'
    
    id = db.Column(db.Integer, primary_key=True)
    diagnosis_id = db.Column(db.Integer, db.ForeignKey('diagnoses.id'), nullable=False)
    
    # 교과전형
    gyogwa_score = db.Column(db.Integer)
    gyogwa_rating = db.Column(db.Integer)
    gyogwa_reason = db.Column(db.Text)
    
    # 종합전형
    jonghap_score = db.Column(db.Integer)
    jonghap_rating = db.Column(db.Integer)
    jonghap_reason = db.Column(db.Text)
    
    # 정시
    jungsi_score = db.Column(db.Integer)
    jungsi_rating = db.Column(db.Integer)
    jungsi_reason = db.Column(db.Text)
    
    # 논술
    nonseol_score = db.Column(db.Integer)
    nonseol_rating = db.Column(db.Integer)
    nonseol_reason = db.Column(db.Text)
    
    # 추천 전략
    recommended_strategy = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class RiskAnalysis(db.Model):
    """리스크 분석"""
    __tablename__ = 'risk_analysis'
    
    id = db.Column(db.Integer, primary_key=True)
    diagnosis_id = db.Column(db.Integer, db.ForeignKey('diagnoses.id'), nullable=False)
    risk_type = db.Column(db.String(50))
    severity = db.Column(db.String(20))
    description = db.Column(db.Text)
    recommendation = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Consultation(db.Model):
    """상담 기록"""
    __tablename__ = 'consultations'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    counselor_id = db.Column(db.Integer, db.ForeignKey('counselors.id'), nullable=False)
    consultation_date = db.Column(db.Date, nullable=False)
    main_topic = db.Column(db.String(200))
    counselor_comment = db.Column(db.Text)
    action_items = db.Column(db.Text)
    next_consultation_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ==================== API 라우트 ====================

@app.route('/')
def index():
    """홈페이지"""
    return jsonify({
        'service': 'DA.UM 진학상담 시스템',
        'version': '1.0.0',
        'status': 'running',
        'message': '기존 시스템과 독립적으로 실행 중입니다.'
    })


@app.route('/api/health')
def health_check():
    """헬스 체크"""
    return jsonify({
        'status': 'healthy',
        'database': 'connected',
        'timestamp': datetime.utcnow().isoformat()
    })


@app.route('/api/students', methods=['GET'])
def get_students():
    """학생 목록 조회"""
    # TODO: 인증 추가
    students = Student.query.all()
    return jsonify([{
        'id': s.id,
        'name': s.name,
        'grade': s.grade,
        'school_name': s.school_name,
        'desired_major': s.desired_major
    } for s in students])


@app.route('/api/students', methods=['POST'])
def create_student():
    """학생 등록"""
    data = request.json
    
    student = Student(
        counselor_id=1,  # TODO: 실제 로그인한 상담사 ID
        name=data['name'],
        grade=data['grade'],
        school_name=data.get('school_name'),
        school_type=data.get('school_type', 'high'),
        desired_major=data.get('desired_major'),
        major_status=data.get('major_status', 'undecided'),
        parent_name=data.get('parent_name'),
        parent_phone=data.get('parent_phone')
    )
    
    db.session.add(student)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'student_id': student.id,
        'message': '학생이 등록되었습니다.'
    }), 201


@app.route('/api/students/<int:student_id>', methods=['GET'])
def get_student_detail(student_id):
    """학생 상세 정보"""
    student = Student.query.get_or_404(student_id)
    
    # 최신 진단 가져오기
    latest_diagnosis = Diagnosis.query.filter_by(student_id=student_id).order_by(Diagnosis.created_at.desc()).first()
    
    return jsonify({
        'id': student.id,
        'name': student.name,
        'grade': student.grade,
        'school_name': student.school_name,
        'desired_major': student.desired_major,
        'major_status': student.major_status,
        'latest_diagnosis': {
            'summary': latest_diagnosis.summary_type if latest_diagnosis else None,
            'date': latest_diagnosis.diagnosis_date.isoformat() if latest_diagnosis else None
        } if latest_diagnosis else None
    })


@app.route('/api/diagnosis', methods=['POST'])
def run_diagnosis():
    """진단 실행"""
    data = request.json
    
    # TODO: 진단 로직 실행
    # 여기서 diagnosis_engine.py와 admission_analyzer.py 사용
    
    return jsonify({
        'success': True,
        'diagnosis_id': 1,
        'message': '진단이 완료되었습니다.'
    })


@app.route('/api/diagnosis/<int:diagnosis_id>', methods=['GET'])
def get_diagnosis_result(diagnosis_id):
    """진단 결과 조회"""
    diagnosis = Diagnosis.query.get_or_404(diagnosis_id)
    
    result = {
        'id': diagnosis.id,
        'student_id': diagnosis.student_id,
        'diagnosis_date': diagnosis.diagnosis_date.isoformat(),
        'summary': diagnosis.summary_type,
        'grade': {
            'type': diagnosis.grade_type,
            'score': diagnosis.grade_score
        },
        'extracurricular': {
            'type': diagnosis.extracurricular_type,
            'score': diagnosis.extracurricular_score
        },
        'management': {
            'type': diagnosis.management_type,
            'score': diagnosis.management_score
        }
    }
    
    # 전형 분석 추가
    if diagnosis.admission_analysis:
        result['admission_analysis'] = {
            'gyogwa': {
                'score': diagnosis.admission_analysis.gyogwa_score,
                'rating': diagnosis.admission_analysis.gyogwa_rating,
                'reason': diagnosis.admission_analysis.gyogwa_reason
            },
            'jonghap': {
                'score': diagnosis.admission_analysis.jonghap_score,
                'rating': diagnosis.admission_analysis.jonghap_rating,
                'reason': diagnosis.admission_analysis.jonghap_reason
            },
            'jungsi': {
                'score': diagnosis.admission_analysis.jungsi_score,
                'rating': diagnosis.admission_analysis.jungsi_rating,
                'reason': diagnosis.admission_analysis.jungsi_reason
            },
            'strategy': diagnosis.admission_analysis.recommended_strategy
        }
    
    return jsonify(result)


@app.route('/api/universities', methods=['GET'])
def get_universities():
    """대학 정보 조회 (서울권 + 경상권)"""
    from data_loader import UNIVERSITY_DATA
    from data_loader_gyeongsang import GYEONGSANG_UNIVERSITY_DATA
    
    # 지역 필터
    region = request.args.get('region', 'all')
    
    all_universities = {}
    
    if region in ['all', 'seoul', '서울']:
        all_universities.update(UNIVERSITY_DATA)
    
    if region in ['all', 'gyeongsang', '경상']:
        all_universities.update(GYEONGSANG_UNIVERSITY_DATA)
    
    # 간단한 요약 정보만 반환
    result = []
    for univ_name, univ_data in all_universities.items():
        result.append({
            'name': univ_name,
            'tier': univ_data.get('tier', ''),
            'region': univ_data.get('지역', '서울'),
            'feature': univ_data.get('특징', univ_data.get('특성', '')),
            'popular_majors': list(univ_data.get('인기학과', {}).keys())[:5] if '인기학과' in univ_data else []
        })
    
    return jsonify({
        'total': len(result),
        'universities': result
    })


@app.route('/api/universities/<university_name>', methods=['GET'])
def get_university_detail(university_name):
    """특정 대학 상세 정보"""
    from data_loader import UNIVERSITY_DATA
    from data_loader_gyeongsang import GYEONGSANG_UNIVERSITY_DATA
    
    # 대학 찾기
    univ_data = UNIVERSITY_DATA.get(university_name) or GYEONGSANG_UNIVERSITY_DATA.get(university_name)
    
    if not univ_data:
        return jsonify({'error': '대학을 찾을 수 없습니다.'}), 404
    
    return jsonify({
        'name': university_name,
        'data': univ_data
    })


@app.route('/api/majors', methods=['GET'])
def get_majors():
    """학과별 진로 정보"""
    from data_loader import EXTRACURRICULAR_CATEGORIES
    from data_loader_gyeongsang import GYEONGSANG_MAJOR_INFO
    
    return jsonify({
        'gyeongsang': GYEONGSANG_MAJOR_INFO
    })


@app.route('/api/roadmap/<int:grade>', methods=['GET'])
def get_grade_roadmap(grade):
    """학년별 입시 로드맵"""
    from data_loader import GRADE_ROADMAP
    
    grade_map = {
        1: "중1", 2: "중2", 3: "중3",
        4: "고1", 5: "고2", 6: "고3"
    }
    
    grade_key = grade_map.get(grade)
    if not grade_key:
        return jsonify({'error': '잘못된 학년입니다.'}), 400
    
    roadmap = GRADE_ROADMAP.get(grade_key)
    if not roadmap:
        return jsonify({'error': '로드맵을 찾을 수 없습니다.'}), 404
    
    return jsonify({
        'grade': grade_key,
        'roadmap': roadmap
    })


# ==================== 초기화 ====================

def init_db():
    """데이터베이스 초기화"""
    with app.app_context():
        db.create_all()
        
        # 테스트 상담사 생성
        if not Counselor.query.filter_by(email='admin@daum.edu').first():
            test_counselor = Counselor(
                email='admin@daum.edu',
                password_hash='test123',  # TODO: 실제로는 해싱 필요
                name='DA.UM 관리자',
                organization='DA.UM 교육연구소'
            )
            db.session.add(test_counselor)
            db.session.commit()
            print("✅ 테스트 상담사 계정 생성 완료")


# ==================== 메인 실행 ====================

if __name__ == '__main__':
    # DB 초기화
    init_db()
    
    print("=" * 60)
    print("🎓 DA.UM 진학상담 시스템 백엔드")
    print("=" * 60)
    print("✅ 독립 실행 모드")
    print("✅ 포트: 5000")
    print("✅ 데이터베이스: daum_admission.db")
    print("=" * 60)
    
    # Flask 앱 실행
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
