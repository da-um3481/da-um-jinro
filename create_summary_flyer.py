#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DA.UM 겨울방학 프로그램 간단 요약 전단지 생성
"""

def create_flyer():
    """간단 요약 전단지 HTML 생성"""
    
    html_content = """<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DA.UM 겨울방학 프로그램 안내</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
            background: #f0f0f0;
            padding: 20px;
        }
        
        .flyer {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        
        .header {
            background: linear-gradient(135deg, #2962FF 0%, #1E88E5 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 42px;
            margin-bottom: 10px;
        }
        
        .header .subtitle {
            font-size: 24px;
            opacity: 0.95;
        }
        
        .content {
            padding: 40px;
        }
        
        .highlight-box {
            background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
            border-left: 5px solid #2962FF;
            padding: 25px;
            margin-bottom: 30px;
            border-radius: 10px;
        }
        
        .highlight-box h2 {
            color: #1565C0;
            font-size: 28px;
            margin-bottom: 15px;
        }
        
        .highlight-box p {
            font-size: 18px;
            line-height: 1.8;
            color: #424242;
        }
        
        .programs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 30px 0;
        }
        
        .program-box {
            background: #F5F5F5;
            padding: 25px;
            border-radius: 10px;
            border: 2px solid #2962FF;
        }
        
        .program-box h3 {
            color: #2962FF;
            font-size: 24px;
            margin-bottom: 15px;
        }
        
        .program-box ul {
            list-style: none;
        }
        
        .program-box li {
            padding: 8px 0;
            font-size: 16px;
            padding-left: 20px;
            position: relative;
        }
        
        .program-box li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #2962FF;
            font-weight: bold;
        }
        
        .features {
            background: #FFF3E0;
            padding: 25px;
            border-radius: 10px;
            margin: 30px 0;
        }
        
        .features h2 {
            color: #E65100;
            font-size: 26px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
        }
        
        .feature-item {
            text-align: center;
            padding: 15px;
        }
        
        .feature-item .icon {
            font-size: 40px;
            margin-bottom: 10px;
        }
        
        .feature-item .text {
            font-size: 16px;
            font-weight: bold;
            color: #424242;
        }
        
        .contact-box {
            background: linear-gradient(135deg, #283593 0%, #3F51B5 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
        }
        
        .contact-box h2 {
            font-size: 28px;
            margin-bottom: 20px;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 40px;
            flex-wrap: wrap;
            margin-top: 20px;
        }
        
        .contact-info div {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }
        
        .contact-info .icon {
            font-size: 36px;
        }
        
        .contact-info strong {
            font-size: 16px;
        }
        
        .contact-info span {
            font-size: 20px;
            font-weight: bold;
        }
        
        .footer {
            background: #263238;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 14px;
        }
        
        @media (max-width: 768px) {
            .programs {
                grid-template-columns: 1fr;
            }
            .features-grid {
                grid-template-columns: 1fr;
            }
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .flyer {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="flyer">
        <div class="header">
            <h1>🎓 DA.UM</h1>
            <div class="subtitle">다움진로진학컨설팅</div>
            <div class="subtitle" style="margin-top: 15px; font-size: 28px;">❄️ 겨울방학 프로그램</div>
        </div>
        
        <div class="content">
            <div class="highlight-box">
                <h2>🎯 프로그램 소개</h2>
                <p>
                    <strong>DA.UM</strong>은 학생 개인별 맞춤형 학습관리와 진로진학 컨설팅을 제공하는 전문 교육기관입니다. 
                    겨울방학 30일 집중 프로그램을 통해 학생들의 학업 성취와 진로 목표 달성을 지원합니다.
                </p>
            </div>
            
            <div class="programs">
                <div class="program-box">
                    <h3>🎓 고등학생</h3>
                    <ul>
                        <li>고1: 기초 다지기</li>
                        <li>고2: 심화 학습</li>
                        <li>고3: 수능 집중</li>
                        <li>내신 관리</li>
                        <li>진로 컨설팅</li>
                    </ul>
                </div>
                
                <div class="program-box">
                    <h3>📖 중학생 이하</h3>
                    <ul>
                        <li>중1~3: 교과 학습</li>
                        <li>예비중(초6): 선행</li>
                        <li>학습 습관 형성</li>
                        <li>내신 대비</li>
                        <li>고교 준비</li>
                    </ul>
                </div>
            </div>
            
            <div class="features">
                <h2>⚙️ 프로그램 특징</h2>
                <div class="features-grid">
                    <div class="feature-item">
                        <div class="icon">📚</div>
                        <div class="text">30일<br/>집중 학습</div>
                    </div>
                    <div class="feature-item">
                        <div class="icon">👨‍🏫</div>
                        <div class="text">1:1<br/>맞춤 관리</div>
                    </div>
                    <div class="feature-item">
                        <div class="icon">📊</div>
                        <div class="text">체계적<br/>관리 시스템</div>
                    </div>
                    <div class="feature-item">
                        <div class="icon">💻</div>
                        <div class="text">온라인<br/>플랫폼</div>
                    </div>
                    <div class="feature-item">
                        <div class="icon">📈</div>
                        <div class="text">정기<br/>피드백</div>
                    </div>
                    <div class="feature-item">
                        <div class="icon">🎯</div>
                        <div class="text">진로진학<br/>컨설팅</div>
                    </div>
                </div>
            </div>
            
            <div class="contact-box">
                <h2>📞 문의 및 상담</h2>
                <div class="contact-info">
                    <div>
                        <div class="icon">📱</div>
                        <strong>전화</strong>
                        <span>010-2657-3481</span>
                    </div>
                    <div>
                        <div class="icon">👤</div>
                        <strong>담당</strong>
                        <span>정라미</span>
                    </div>
                </div>
                <p style="margin-top: 25px; font-size: 16px; opacity: 0.95;">
                    🌐 da-um3481.github.io/da-um-jinro
                </p>
            </div>
        </div>
        
        <div class="footer">
            © 2025 DA.UM 다움진로진학컨설팅 | 함께 만드는 성공적인 겨울방학
        </div>
    </div>
</body>
</html>
"""
    
    output_file = '/home/user/webapp/DA_UM_겨울방학_프로그램_요약.html'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"✅ 요약 전단지 생성 완료: {output_file}")
    return output_file

if __name__ == "__main__":
    create_flyer()
