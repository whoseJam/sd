#include<bits/stdc++.h>
using namespace std;

int read(){
	int s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

const int N=1005;
int n,sx,sy,ex,ey,vis[N][N];
char s[N][N];
int d[N][N];
int dx[4]={0,1,0,-1};
int dy[4]={1,0,-1,0};

struct node{
	int x,y;
};

bool check(int x,int y){
	return 1<=x&&x<=n&&1<=y&&y<=n&&vis[x][y]==0&&s[x][y]!='1';
}

void Bfs(){
	queue<node>q;
	q.push((node){sx,sy});
	vis[sx][sy]=1;
	while(q.size()){
		node u=q.front();q.pop();
		for(int i=0;i<4;i++){
			int tx=u.x+dx[i];
			int ty=u.y+dy[i];
			if(check(tx,ty)){
				vis[tx][ty]=1;
				q.push((node){tx,ty});
				d[tx][ty]=d[u.x][u.y]+1;
			}
		}
	}
}

int main(){
	cin>>n;
	for(int i=1;i<=n;i++)
		for(int j=1;j<=n;j++)
			cin>>s[i][j];
	cin>>sx>>sy>>ex>>ey;
	Bfs();
	cout<<d[ex][ey];
	return 0;
}

