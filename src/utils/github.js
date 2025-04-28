import fetch from 'node-fetch';
import https from 'https';

// 创建信任所有证书的 Agent
const insecureAgent = new https.Agent({
  rejectUnauthorized: false
});

// 生成 GitHub API 请求头
function createHeaders() {
  // 优先使用构建时环境变量
  const token = process.env.GITHUB_TOKEN || import.meta.env.GITHUB_TOKEN;
  
  if (!token) {
    console.error('GitHub Token未配置！');
    throw new Error('服务器配置错误');
  }

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}


// 获取基础统计数据
export async function getGitHubStats(username) {
  const token = import.meta.env.GITHUB_TOKEN; // 使用 Vercel 环境变量
  
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers: createHeaders(),agent: insecureAgent  }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers: createHeaders(),agent: insecureAgent  })
    ]);

    if (userRes.status === 401) {
        throw new Error('认证失败：无效的GitHub令牌');
      }
      if (userRes.status === 403) {
        const resetTime = new Date(userRes.headers.get('x-ratelimit-reset') * 1000);
        throw new Error(`API限额已用尽，下次重置时间：${resetTime.toLocaleTimeString()}`);
      }
      if (!userRes.ok) {
        throw new Error(`请求失败：${userRes.statusText}`);
      }


    const userData = await userRes.json();
    const reposData = await reposRes.json();

    // 计算语言分布
    const languages = reposData.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {});

    const totalRepos = userData.public_repos;
    const languageStats = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        percent: ((count / totalRepos) * 100).toFixed(1)
      }));

    return {
      repos: userData.public_repos,
      stars: reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      languages: languageStats
    };
    
  } catch (error) {
    console.error('GitHub API 请求失败:', error);
    return {
      repos: 0,
      stars: 0,
      languages: []
    };
  }
}
