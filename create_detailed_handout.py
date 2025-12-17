#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DA.UM 겨울방학 프로그램 상세 안내 자료 생성 (HTML)
"""

def create_handout():
    """상세 안내 자료 HTML 생성"""
    
    html_content = """<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DA.UM 겨울방학 프로그램 상세 안내</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        header {
            background: linear-gradient(135deg, #2962FF 0%, #1E88E5 100%);
            color: white;
            padding: 60px 40px;
            text-align: center;
        }
        
        header h1 {
            font-size: 48px;
            margin-bottom: 20px;
            font-weight: bold;
        }
        
        header p {
            font-size: 24px;
            opacity: 0.95;
        }
        
        .section {
            padding: 50px 40px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .section:last-child {
            border-bottom: none;
        }
        
        .section-title {
            font-size: 36px;
            color: #2962FF;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 3px solid #2962FF;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .intro-box {
            background: #E3F2FD;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        
        .intro-box h3 {
            font-size: 24px;
            color: #2962FF;
            margin-bottom: 20px;
        }
        
        .intro-box ul {
            list-style: none;
        }
        
        .intro-box li {
            padding: 10px 0;
            font-size: 18px;
            padding-left: 30px;
            position: relative;
        }
        
        .intro-box li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #2962FF;
            font-weight: bold;
            font-size: 20px;
        }
        
        .program-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
            margin-top: 30px;
        }
        
        .program-card {
            background: white;
            border: 2px solid #2962FF;
            border-radius: 15px;
            padding: 30px;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .program-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(41, 98, 255, 0.2);
        }
        
        .program-card h3 {
            font-size: 28px;
            color: #2962FF;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .program-card .grade {
            font-size: 20px;
            font-weight: bold;
            color: #666;
            margin-bottom: 15px;
        }
        
        .program-card .description {
            font-size: 16px;
            line-height: 1.8;
            color: #555;
            margin-bottom: 20px;
        }
        
        .program-card ul {
            list-style: none;
        }
        
        .program-card li {
            padding: 8px 0;
            padding-left: 25px;
            position: relative;
            font-size: 15px;
        }
        
        .program-card li:before {
            content: "•";
            position: absolute;
            left: 0;
            color: #2962FF;
            font-size: 20px;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        .feature-item {
            background: #F5F5F5;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
        }
        
        .feature-item .icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        
        .feature-item h4 {
            font-size: 20px;
            color: #2962FF;
            margin-bottom: 10px;
        }
        
        .feature-item p {
            font-size: 15px;
            color: #666;
        }
        
        .schedule-box {
            background: #FFF3E0;
            padding: 30px;
            border-radius: 10px;
            border-left: 5px solid #FF9800;
        }
        
        .schedule-box h3 {
            font-size: 24px;
            color: #E65100;
            margin-bottom: 20px;
        }
        
        .schedule-item {
            padding: 15px 0;
            border-bottom: 1px solid #FFE0B2;
        }
        
        .schedule-item:last-child {
            border-bottom: none;
        }
        
        .schedule-item strong {
            color: #E65100;
            font-size: 18px;
            display: block;
            margin-bottom: 5px;
        }
        
        .benefits-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        .benefit-item {
            background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
            padding: 25px;
            border-radius: 10px;
            display: flex;
            align-items: start;
            gap: 15px;
        }
        
        .benefit-item .emoji {
            font-size: 36px;
        }
        
        .benefit-item .content h4 {
            font-size: 20px;
            color: #1565C0;
            margin-bottom: 8px;
        }
        
        .benefit-item .content p {
            font-size: 15px;
            color: #424242;
        }
        
        .contact-section {
            background: linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%);
            padding: 50px;
            text-align: center;
            border-radius: 10px;
            margin: 30px 0;
        }
        
        .contact-section h3 {
            font-size: 32px;
            color: #283593;
            margin-bottom: 30px;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 50px;
            flex-wrap: wrap;
            margin-top: 20px;
        }
        
        .contact-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
        
        .contact-item .icon {
            font-size: 48px;
        }
        
        .contact-item strong {
            font-size: 18px;
            color: #283593;
        }
        
        .contact-item span {
            font-size: 20px;
            color: #424242;
        }
        
        footer {
            background: #263238;
            color: white;
            text-align: center;
            padding: 30px;
        }
        
        @media print {
            body {
                background: white;
            }
            .container {
                box-shadow: none;
            }
            .program-card, .benefit-item {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🎓 DA.UM 다움진로진학컨설팅</h1>
            <p>2025 겨울방학 프로그램 상세 안내</p>
        </header>
        
        <div class="section">
            <h2 class="section-title">🎯 DA.UM 소개</h2>
            <div class="intro-box">
                <h3>전문 진로진학 컨설팅 기관</h3>
                <ul>
                    <li>학생 개인별 맞춤형 학습관리 시스템</li>
                    <li>고등학생 및 중학생 전문 프로그램 운영</li>
                    <li>체계적인 30일/100일 학습 관리</li>
                    <li>1:1 맞춤형 진로진학 컨설팅</li>
                    <li>온라인 학습관리 플랫폼 제공</li>
                </ul>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">❄️ 겨울방학 프로그램 특징</h2>
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="icon">📚</div>
                    <h4>30일 집중 학습</h4>
                    <p>방학 기간 동안 체계적인 집중 학습 프로그램</p>
                </div>
                <div class="feature-item">
                    <div class="icon">📊</div>
                    <h4>맞춤형 커리큘럼</h4>
                    <p>학년별, 수준별 개인 맞춤 학습 계획</p>
                </div>
                <div class="feature-item">
                    <div class="icon">👨‍🏫</div>
                    <h4>1:1 학습관리</h4>
                    <p>개인별 밀착 관리 및 피드백 제공</p>
                </div>
                <div class="feature-item">
                    <div class="icon">💻</div>
                    <h4>온라인 시스템</h4>
                    <p>체계적인 온라인 학습관리 플랫폼</p>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">🎓 고등학생 프로그램</h2>
            <div class="program-grid">
                <div class="program-card">
                    <h3>📘 고등학교 1학년</h3>
                    <div class="grade">예비 고1 / 고1</div>
                    <div class="description">
                        고등학교 학습의 기초를 탄탄히 다지고, 효과적인 학습 습관을 형성하는 프로그램입니다.
                    </div>
                    <ul>
                        <li>기초 학력 진단 및 보완</li>
                        <li>고등 교과 선행 학습</li>
                        <li>내신 대비 학습 전략</li>
                        <li>효과적인 학습 습관 형성</li>
                        <li>과목별 맞춤 학습 계획</li>
                        <li>정기 모의고사 및 분석</li>
                    </ul>
                </div>
                
                <div class="program-card">
                    <h3>📗 고등학교 2학년</h3>
                    <div class="grade">예비 고2 / 고2</div>
                    <div class="description">
                        심화 학습과 수능 기초를 다지며, 명확한 진로 목표를 설정하는 프로그램입니다.
                    </div>
                    <ul>
                        <li>교과 심화 학습</li>
                        <li>수능 기초 다지기</li>
                        <li>진로 탐색 및 목표 설정</li>
                        <li>선택 과목 전략 수립</li>
                        <li>내신 및 모의고사 대비</li>
                        <li>학생부 관리 컨설팅</li>
                    </ul>
                </div>
                
                <div class="program-card">
                    <h3>📕 고등학교 3학년</h3>
                    <div class="grade">예비 고3 / 고3</div>
                    <div class="description">
                        수능 집중 대비와 입시 전략으로 대학 진학의 목표를 달성하는 프로그램입니다.
                    </div>
                    <ul>
                        <li>수능 집중 대비</li>
                        <li>취약 영역 집중 보완</li>
                        <li>입시 전략 수립</li>
                        <li>대학별 맞춤 준비</li>
                        <li>실전 모의고사 훈련</li>
                        <li>최종 마무리 학습</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">📖 중학생 이하 프로그램</h2>
            <div class="program-grid">
                <div class="program-card">
                    <h3>📚 중학교 1~3학년</h3>
                    <div class="grade">중1 / 중2 / 중3</div>
                    <div class="description">
                        중학교 교과 학습을 체계적으로 관리하고, 고등학교 진학을 준비하는 프로그램입니다.
                    </div>
                    <ul>
                        <li>교과 학습 완벽 관리</li>
                        <li>내신 시험 대비</li>
                        <li>학습 역량 강화</li>
                        <li>자기주도 학습 훈련</li>
                        <li>진로 탐색 활동</li>
                        <li>고등학교 준비 (중3)</li>
                    </ul>
                </div>
                
                <div class="program-card">
                    <h3>🎒 예비 중학생</h3>
                    <div class="grade">초등학교 6학년</div>
                    <div class="description">
                        중학교 생활을 미리 준비하고, 성공적인 중학교 생활의 기반을 다지는 프로그램입니다.
                    </div>
                    <ul>
                        <li>중학교 교과 선행 학습</li>
                        <li>학습 습관 형성</li>
                        <li>기초 학력 진단 및 보완</li>
                        <li>중학교 적응 준비</li>
                        <li>학습 계획 수립 훈련</li>
                        <li>자신감 향상 프로그램</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">⚙️ 학습관리 시스템</h2>
            <div class="schedule-box">
                <h3>체계적인 관리 프로세스</h3>
                <div class="schedule-item">
                    <strong>📅 일일 학습 관리</strong>
                    매일 학습 진도 체크 및 과제 관리
                </div>
                <div class="schedule-item">
                    <strong>📊 주간 리포트</strong>
                    주간 학습 성과 분석 및 피드백 제공
                </div>
                <div class="schedule-item">
                    <strong>💻 온라인 플랫폼</strong>
                    학습 자료 제공 및 온라인 관리 시스템
                </div>
                <div class="schedule-item">
                    <strong>👪 학부모 상담</strong>
                    정기적인 학부모 상담 및 진도 공유
                </div>
                <div class="schedule-item">
                    <strong>📈 개인별 분석</strong>
                    취약점 분석 및 맞춤형 보완 학습
                </div>
                <div class="schedule-item">
                    <strong>📝 정기 평가</strong>
                    모의고사 및 학업 성취도 평가
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">✨ 프로그램 기대 효과</h2>
            <div class="benefits-list">
                <div class="benefit-item">
                    <div class="emoji">📚</div>
                    <div class="content">
                        <h4>학습 습관 형성</h4>
                        <p>체계적이고 효율적인 학습 습관을 통해 지속 가능한 성장 기반 마련</p>
                    </div>
                </div>
                <div class="benefit-item">
                    <div class="emoji">📈</div>
                    <div class="content">
                        <h4>성적 향상</h4>
                        <p>개인별 맞춤 학습을 통한 확실한 학업 성취도 향상</p>
                    </div>
                </div>
                <div class="benefit-item">
                    <div class="emoji">💪</div>
                    <div class="content">
                        <h4>자기주도 학습</h4>
                        <p>스스로 계획하고 실행하는 자기주도 학습 능력 배양</p>
                    </div>
                </div>
                <div class="benefit-item">
                    <div class="emoji">🎯</div>
                    <div class="content">
                        <h4>진로 목표 설정</h4>
                        <p>명확한 진로 방향 설정을 통한 학습 동기 부여</p>
                    </div>
                </div>
                <div class="benefit-item">
                    <div class="emoji">🏆</div>
                    <div class="content">
                        <h4>입시 경쟁력</h4>
                        <p>체계적인 준비를 통한 대학 입시 경쟁력 강화</p>
                    </div>
                </div>
                <div class="benefit-item">
                    <div class="emoji">😊</div>
                    <div class="content">
                        <h4>자신감 향상</h4>
                        <p>성취 경험을 통한 학습 자신감 및 동기 부여</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <div class="contact-section">
                <h3>📞 문의 및 상담</h3>
                <div class="contact-info">
                    <div class="contact-item">
                        <div class="icon">📱</div>
                        <strong>전화번호</strong>
                        <span>010-2657-3481</span>
                    </div>
                    <div class="contact-item">
                        <div class="icon">👤</div>
                        <strong>담당자</strong>
                        <span>정라미</span>
                    </div>
                    <div class="contact-item">
                        <div class="icon">🌐</div>
                        <strong>웹사이트</strong>
                        <span>da-um3481.github.io/da-um-jinro</span>
                    </div>
                </div>
                <p style="margin-top: 30px; font-size: 18px; color: #424242;">
                    💡 학생 맞춤형 진로진학 컨설팅 | 💡 체계적인 학습관리 시스템
                </p>
            </div>
        </div>
        
        <footer>
            <p>© 2025 DA.UM 다움진로진학컨설팅. All rights reserved.</p>
            <p style="margin-top: 10px; opacity: 0.8;">함께 만드는 성공적인 겨울방학</p>
        </footer>
    </div>
</body>
</html>
"""
    
    output_file = '/home/user/webapp/DA_UM_겨울방학_프로그램_상세안내.html'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"✅ 상세 안내 자료 생성 완료: {output_file}")
    return output_file

if __name__ == "__main__":
    create_handout()
